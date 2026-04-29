import Background from '@/components/layout/background';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function SobreNos() {
  const router = useRouter();

  return (
    <Background 
      title="FAFYL" 
      showUserIcon={true}
      onUserIconPress={() => router.push('/profile')}
    >
      <View style={styles.whiteContainer}>
        <Text style={styles.titleText}>Sobre nós:</Text>
        
        <View style={styles.mainCard}>
          <ScrollView showsVerticalScrollIndicator={false}>
          
          <Text style={styles.descriptionText}>
            Nós, com o objetivo de orientar pessoas na escolha de suas futuras trajetórias acadêmicas, desenvolvemos o FAFYL.{"\n\n"}
            A plataforma foi criada para auxiliar na tomada de decisão de forma mais clara e prática, reunindo informações relevantes 
            sobre cursos e instituições de ensino.
            Por meio de um questionário objetivo, o sistema analisa o perfil, interesses e preferências do usuário, indicando
             possibilidades de graduação mais alinhadas com suas características.{"\n\n"}
            O FAFYL é direcionado principalmente a adolescentes e jovens adultos que ainda estão em dúvida sobre qual 
            curso seguir, oferecendo um apoio inicial para essa escolha tão importante.
          </Text>
        </ScrollView>
      </View>

      
        <View style={styles.footerCard}>
          <Text style={styles.footerTitle}>Grupo:</Text>
          <Text style={styles.footerNames}>Angelina, Henrique, Júlia, Ruan, Ryan e Victor M.</Text>
        </View>
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
    paddingTop: 30,
    marginTop: 10,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  mainCard: {
    width: '100%',
    height: '60%', // Diminuí o tamanho (ajuste conforme necessário)
    backgroundColor: '#D9D9D9',
    borderRadius: 30,
    padding: 20,
    marginBottom: 20, // Espaço entre o quadrado principal e o rodapé
  },
  descriptionText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    textAlign: 'justify',
  },
  footerCard: {
    width: '100%',
    backgroundColor: '#D9D9D9',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#010080', // Usei o azul do seu app para dar destaque
    marginBottom: 5,
  },
  footerNames: {
    fontSize: 13,
    color: '#444',
    textAlign: 'center',
  },
});