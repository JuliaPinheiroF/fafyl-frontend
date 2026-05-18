import Background from '@/components/layout/background';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ComoFunciona() {
  const router = useRouter();

  return (
    <Background 
      title="FAFYL" 
      showUserIcon={true}
      onUserIconPress={() => router.push('/profile')}
    >
      <View style={styles.whiteContainer}>
        {/* Header Interno com Seta e Título */}
        <View style={styles.innerHeader}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.titleText}>Como funciona o nosso quiz:</Text>
        </View>

        {/* Card Cinza com o Texto */}
        <View style={styles.infoCard}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.descriptionText}>
              Responda a uma sequência de perguntas, que exploram aspectos como interesses pessoais, afinidade com disciplinas escolares, habilidades cognitivas e comportamentais e expectativas em relação ao futuro profissional.
              {"\n\n"}
              Nosso Quiz orientador é uma experiência interativa para guiar estudantes no processo de decisão sobre qual curso superior seguir.
            </Text>
          </ScrollView>
        </View>

        {/* Botão Continuar */}
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={() => router.push('/quiz' as any)}
        >
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  whiteContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 25,
    paddingTop: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  innerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 10,
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#D9D9D9',
    borderRadius: 40,
    padding: 25,
    height: '60%',
  },
  descriptionText: {
    fontSize: 16,
    color: '#000',
    lineHeight: 24,
    textAlign: 'left',
  },
  continueButton: {
    backgroundColor: '#FFDE59',
    width: '70%',
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});