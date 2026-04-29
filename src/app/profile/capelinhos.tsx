import Background from '@/components/layout/background';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Mapeamento das imagens (o Expo as carrega via require)
const AVATARES = [
  { id: '1', img: require('@/assets/images/curioso.png') },
  { id: '2', img: require('@/assets/images/triste.png') },
  { id: '3', img: require('@/assets/images/muitofeliz.png') },
  { id: '4', img: require('@/assets/images/serio.png') },
];

export default function SelecionarAvatar() {
  const router = useRouter();
  const [selecionado, setSelecionado] = useState('1'); // Inicia com o ID 1 selecionado

  return (
    <Background 
      title="" // Título vazio como na imagem
      showBackButton={true} 
      onBackPress={() => router.back()}
    >
      <View style={styles.content}>
        {/* Avatar Principal no Topo */}
        <View style={styles.mainAvatarContainer}>
          <View style={styles.circle}>
            <Image 
              source={AVATARES.find(a => a.id === selecionado)?.img} 
              style={styles.mainAvatarImage} 
            />
          </View>
        </View>

        {/* Card Branco com o Grid */}
        <View style={styles.whiteCard}>
          <View style={styles.grid}>
            {AVATARES.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => setSelecionado(item.id)}
                style={[
                  styles.avatarOption,
                  selecionado === item.id && styles.selectedBorder // Aplica a borda se selecionado
                ]}
              >
                <Image source={item.img} style={styles.optionImage} />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            style={styles.saveButton}
            onPress={() => router.back()}
          >
            <Text style={styles.saveButtonText}>Salvar Alterações</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, alignItems: 'center' },
  mainAvatarContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  mainAvatarImage: { width: 120, height: 120, resizeMode: 'contain' },
  whiteCard: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    width: '100%',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 40,
  },
  avatarOption: {
    width: 140,
    height: 140,
    backgroundColor: '#D9D9D9',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedBorder: {
    borderColor: '#40E0D0', // Cor Verde Água (Turquesa)
  },
  optionImage: { width: 100, height: 100, resizeMode: 'contain' },
  saveButton: {
    backgroundColor: '#FFDE59',
    width: '90%',
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  saveButtonText: { fontWeight: 'bold', fontSize: 18, color: '#000' },
});