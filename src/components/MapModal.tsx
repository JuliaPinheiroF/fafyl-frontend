import React, { useEffect, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Circle } from 'react-native-svg';
import useLocationAndRoute from '@/hooks/useLocationAndRoute';
import {
  getTileUrl,
  formatDistance,
  formatTime,
} from '@/services/geoapifyService';

interface MapModalProps {
  visible: boolean;
  onClose: () => void;
  destination: {
    lat: number;
    lon: number;
    name: string;
    collegeName: string;
  };
}

function DisconnectedIcon() {
  return (
    <Svg width={80} height={80} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke="#666" strokeWidth="2" />
      <Path d="M4 4L20 20" stroke="#666" strokeWidth="2" strokeLinecap="round" />
      <Path d="M7 7L9 9" stroke="#666" strokeWidth="2" strokeLinecap="round" />
      <Path d="M17 17L15 15" stroke="#666" strokeWidth="2" strokeLinecap="round" />
      <Path d="M4.5 7.5C5.5 6 7 5 9 5C11 5 12 6 12 6C12 6 13 5 15 5C17 5 18.5 6 19.5 7.5" stroke="#666" strokeWidth="2" strokeLinecap="round" />
      <Path d="M6.5 11C7.5 9.5 9 8.5 11 8.5C13 8.5 14.5 9.5 15.5 11" stroke="#666" strokeWidth="2" strokeLinecap="round" />
      <Path d="M8.5 14.5C9.5 13.5 10.5 13 12 13C13.5 13 14.5 13.5 15.5 14.5" stroke="#666" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function toScriptJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

interface MapHtmlOptions {
  destination: MapModalProps['destination'];
  origin: { lat: number; lon: number } | null;
  route: { latitude: number; longitude: number }[];
}

function buildMapHtml({ destination, origin, route }: MapHtmlOptions): string {
  const tileUrl = toScriptJson(getTileUrl());
  const destJson = toScriptJson({ lat: destination.lat, lng: destination.lon });
  const destNameJson = toScriptJson(destination.name);
  const originJson = origin ? toScriptJson({ lat: origin.lat, lng: origin.lon }) : 'null';
  const routeJson = toScriptJson(
    route.map((coordinate) => [coordinate.latitude, coordinate.longitude])
  );

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    html, body, #map { height: 100%; margin: 0; padding: 0; background: #e5e5e5; }
    .leaflet-control-attribution { font-size: 9px; }
    .origin-dot {
      width: 18px; height: 18px; border-radius: 50%;
      background: #1E88E5; border: 3px solid #fff;
      box-shadow: 0 0 0 3px rgba(30, 136, 229, 0.35);
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    (function () {
      var map = L.map('map', { zoomControl: true, attributionControl: true });
      L.tileLayer(${tileUrl}, {
        maxZoom: 19,
        minZoom: 1,
        attribution: '&copy; OpenStreetMap &copy; Geoapify'
      }).addTo(map);

      var dest = ${destJson};
      var origin = ${originJson};
      var route = ${routeJson};

      var bounds = L.latLngBounds([[dest.lat, dest.lng]]);

      L.marker([dest.lat, dest.lng], {
        icon: L.divIcon({
          className: '',
          html: '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 24 24" fill="#FF0000"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>',
          iconSize: [30, 40],
          iconAnchor: [15, 40]
        })
      }).addTo(map).bindPopup(${destNameJson});

      if (origin) {
        L.marker([origin.lat, origin.lng], {
          icon: L.divIcon({
            className: '',
            html: '<div class="origin-dot"></div>',
            iconSize: [18, 18],
            iconAnchor: [9, 9]
          })
        }).addTo(map).bindPopup('Você');
        bounds.extend([origin.lat, origin.lng]);
      }

      if (route && route.length > 0) {
        L.polyline(route, { color: '#010080', weight: 5, opacity: 0.9 }).addTo(map);
        route.forEach(function (point) { bounds.extend(point); });
      } else if (origin) {
        L.polyline([[origin.lat, origin.lng], [dest.lat, dest.lng]], {
          color: '#FF0000',
          weight: 3,
          dashArray: '10,5'
        }).addTo(map);
      }

      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
      setTimeout(function () { map.invalidateSize(); }, 200);
    })();
  </script>
</body>
</html>`;
}

export default function MapModal({ visible, onClose, destination }: MapModalProps) {
  const {
    currentLocation,
    route,
    loading,
    error,
    errorMessage,
    calculateRouteTo,
  } = useLocationAndRoute();

  useEffect(() => {
    if (visible && destination.lat !== 0 && destination.lon !== 0) {
      calculateRouteTo({ lat: destination.lat, lon: destination.lon });
    }
  }, [visible, destination]);

  const routeCoords = useMemo(
    () =>
      route
        ? route.coordinates.map(([lon, lat]) => ({ latitude: lat, longitude: lon }))
        : [],
    [route]
  );

  const mapHtml = useMemo(
    () =>
      buildMapHtml({
        destination,
        origin: currentLocation,
        route: routeCoords,
      }),
    [destination.lat, destination.lon, destination.name, currentLocation, routeCoords]
  );

  const routeStart = routeCoords[0];
  const routeEnd = routeCoords[routeCoords.length - 1];
  const mapKey = [
    'map',
    routeCoords.length,
    routeStart?.latitude ?? 0,
    routeStart?.longitude ?? 0,
    routeEnd?.latitude ?? 0,
    routeEnd?.longitude ?? 0,
    currentLocation?.lat ?? 0,
    currentLocation?.lon ?? 0,
    destination.lat,
    destination.lon,
  ].join('-');

  const renderContent = () => {
    if (error) {
      return (
        <View style={styles.errorContainer}>
          <DisconnectedIcon />
          <Text style={styles.errorText}>{errorMessage}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => calculateRouteTo({ lat: destination.lat, lon: destination.lon })}
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <>
        <View style={styles.mapContainer}>
          <WebView
            key={mapKey}
            source={{ html: mapHtml }}
            style={styles.map}
            originWhitelist={['*']}
            javaScriptEnabled
            domStorageEnabled
            scrollEnabled={false}
            setBuiltInZoomControls={false}
            startInLoadingState
            renderLoading={() => (
              <View style={styles.mapLoading}>
                <ActivityIndicator size="large" color="#010080" />
              </View>
            )}
          />
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="location" size={20} color="#010080" />
              <Text style={styles.infoLabel}>Destino</Text>
              <Text style={styles.infoValue} numberOfLines={1}>
                {destination.collegeName}
              </Text>
            </View>
          </View>

          {route && (
            <View style={styles.routeInfo}>
              <View style={styles.routeInfoItem}>
                <Text style={styles.routeInfoLabel}>Distância</Text>
                <Text style={styles.routeInfoValue}>
                  {formatDistance(route.distance)}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.routeInfoItem}>
                <Text style={styles.routeInfoLabel}>Tempo</Text>
                <Text style={styles.routeInfoValue}>
                  {formatTime(route.time)}
                </Text>
              </View>
            </View>
          )}
        </View>
      </>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#010080" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Rota até o campus</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          {loading && !route ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#010080" />
              <Text style={styles.loadingText}>Carregando rota...</Text>
            </View>
          ) : (
            renderContent()
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#010080',
  },
  placeholder: {
    width: 44,
  },
  content: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
    backgroundColor: '#e5e5e5',
  },
  mapLoading: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#010080',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  infoRow: {
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#010080',
  },
  routeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  routeInfoItem: {
    alignItems: 'center',
    flex: 1,
  },
  routeInfoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  routeInfoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#010080',
  },
  divider: {
    width: 1,
    backgroundColor: '#EEE',
  },
});
