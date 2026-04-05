import Background from '@/components/layout/background';
import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function TabPage() {
  return (
    <Background title="FAFYL" showUserIcon={true}>
      <View style={styles.whiteCard}>
        <View style={styles.container}>
          <Text style={styles.text}>Tela em Construção</Text>
        </View>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  whiteCard: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    width: width,
    marginTop: 40, // Mantém a distância da logo
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
});