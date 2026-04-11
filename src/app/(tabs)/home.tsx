import Background from '@/components/layout/background';
import Corrossel from '@/components/ui/corrossel';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function Home() {
  return (
    <Background title="FAFYL" showUserIcon={true}
      onUserIconPress={() => router.push('/profile' as any)}>
      <View style={styles.whiteContainer}>
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.sectionTitle}>Universidades em destaque:</Text>
          
          <Corrossel />

          <View style={styles.quizSection}>
            <Text style={styles.sectionTitle}>Faça nosso Quiz Indicador:</Text>
            <TouchableOpacity style={styles.quizButton}>
              <Text style={styles.quizButtonText}>Iniciar quiz</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  whiteContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    width: width, 
    marginTop: 40, // Distância da logo FAFYL para não tampar
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 110, // Espaço extra para não sumir atrás da barra azul
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000',
  },
  highlightCard: {
    backgroundColor: '#D9D9D9',
    height: 250,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 90,
  },
  cardText: {
    fontSize: 18,
    color: '#333',
  },
  quizSection: {
    alignItems: 'center',
  },
  quizButton: {
    backgroundColor: '#FFDE59',
    width: '100%',
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  quizButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});