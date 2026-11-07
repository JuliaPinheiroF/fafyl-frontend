import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

export default function MapModal({ visible, onClose, destination }: MapModalProps) {
  const openStreetMapUrl = `https://www.openstreetmap.org/?mlat=${destination.lat}&mlon=${destination.lon}#map=16/${destination.lat}/${destination.lon}`;

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
          <Ionicons name="map-outline" size={80} color="#010080" />
          <Text style={styles.collegeName}>{destination.collegeName}</Text>
          <Text style={styles.destinationName}>{destination.name}</Text>
          <Text style={styles.message}>
            O mapa interativo está disponível no aplicativo móvel.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => Linking.openURL(openStreetMapUrl)}
          >
            <Text style={styles.buttonText}>Abrir no OpenStreetMap</Text>
          </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  collegeName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#010080',
    textAlign: 'center',
  },
  destinationName: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 8,
  },
  button: {
    backgroundColor: '#010080',
    borderRadius: 30,
    paddingHorizontal: 28,
    paddingVertical: 16,
    marginTop: 16,
  },
  buttonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
