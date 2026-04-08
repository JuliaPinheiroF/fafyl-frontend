import Background from '@/components/layout/background';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function BuscaScreen() {
  return (
    <Background title="FAFYL" showUserIcon={true}>
      <View style={styles.container}>
        <Text style={styles.subtitle}>O que você procura?</Text>

        <View style={styles.cardsRow}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push('/busca/faculdades' as any)}
          >
            <Ionicons name="school" size={48} color="#FFD700" />
            <Text style={styles.cardTitle}>Faculdades</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push('/busca/cursos' as any)}
          >
            <Ionicons name="book" size={48} color="#FFD700" />
            <Text style={styles.cardTitle}>Cursos</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    width: width,
    marginTop: 40,
    paddingHorizontal: 25,
    paddingTop: 40,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#010080',
    borderRadius: 25,
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 12,
  },
});
