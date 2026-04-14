import React, { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Polyline, UrlTile } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Circle } from 'react-native-svg';
import useLocationAndRoute from '@/hooks/useLocationAndRoute';
import {
  getTileUrl,
  convertToLatLng,
  formatDistance,
  formatTime,
} from '@/services/geoapifyService';

const { width, height } = Dimensions.get('window');

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

export default function MapModal({ visible, onClose, destination }: MapModalProps) {
  const {
    currentLocation,
    route,
    loading,
    error,
    errorMessage,
    getCurrentLocation,
    calculateRouteTo,
  } = useLocationAndRoute();

  useEffect(() => {
    if (visible && destination.lat !== 0 && destination.lon !== 0) {
      calculateRouteTo({ lat: destination.lat, lon: destination.lon });
    }
  }, [visible, destination]);

  const originCoords = currentLocation
    ? { latitude: currentLocation.lat, longitude: currentLocation.lon }
    : null;

  const destCoords = {
    latitude: destination.lat,
    longitude: destination.lon,
  };

  const routeCoords = route ? convertToLatLng(route.coordinates) : [];

  // Calcular região inicial para centralizar o mapa
  const initialRegion = originCoords
    ? {
        latitude: (originCoords.latitude + destCoords.latitude) / 2,
        longitude: (originCoords.longitude + destCoords.longitude) / 2,
        latitudeDelta:
          Math.abs(originCoords.latitude - destCoords.latitude) * 1.5 + 0.02,
        longitudeDelta:
          Math.abs(originCoords.longitude - destCoords.longitude) * 1.5 + 0.02,
      }
    : {
        latitude: destCoords.latitude,
        longitude: destCoords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };

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
        <MapView
          key={`map-${route?.coordinates?.length || 0}`}
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={true}
          showsMyLocationButton={false}
          showsCompass={false}
        >
          <UrlTile
            urlTemplate={getTileUrl()}
            maximumZ={19}
            minimumZ={1}
          />

          {currentLocation && originCoords && (
            <Marker coordinate={originCoords} title="Você" anchor={{ x: 0.5, y: 0.5 }}>
              <View style={styles.originMarker}>
                <View style={styles.originMarkerInner} />
              </View>
            </Marker>
          )}

          <Marker coordinate={destCoords} title={destination.name} anchor={{ x: 0.5, y: 1 }}>
            <View style={styles.destMarkerContainer}>
              <Ionicons name="school" size={24} color="#FF0000" />
            </View>
          </Marker>

          {routeCoords.length > 0 ? (
            <Polyline
              coordinates={routeCoords}
              strokeColor="#010080"
              strokeWidth={5}
            />
          ) : currentLocation && originCoords ? (
            <Polyline
              coordinates={[originCoords, destCoords]}
              strokeColor="#FF0000"
              strokeWidth={3}
              lineDashPattern={[10, 5]}
            />
          ) : null}
        </MapView>

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
  map: {
    flex: 1,
  },
  markerContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
    borderWidth: 2,
    borderColor: '#FF0000',
  },
  originMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2196F3',
    borderWidth: 3,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  originMarkerInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  destMarkerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
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
