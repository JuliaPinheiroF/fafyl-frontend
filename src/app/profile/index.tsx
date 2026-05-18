import Background from '@/components/layout/background';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { getCapelinhoImage, getUserCapelinho } from '@/services/capelinhoService';

const { width } = Dimensions.get('window');

export default function Profile() {
  const router = useRouter();
  const [capelinhoId, setCapelinhoId] = useState<number | null>(null);

  useEffect(() => {
    getUserCapelinho().then(setCapelinhoId);
  }, []);

  const avatarImage = getCapelinhoImage(capelinhoId);

  return (
    <Background
      title="Meu Perfil"
      titleSize={30}
      centerTitle={true}
      showBackButton={true}
      onBackPress={() => router.back()}
    >
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            <Image source={avatarImage} style={styles.avatarImage} />
          </View>
          <TouchableOpacity
            style={styles.changePhotoButton}
            onPress={() => router.push('/profile/capelinhos' as any)}
          >
            <Text style={styles.changePhotoText}>Alterar foto de perfil</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.whiteCard}>
          <View style={styles.inputContainer}>
            <TextInput style={styles.input} placeholder="User" placeholderTextColor="#666" />
            <TextInput style={styles.input} placeholder="Nome" placeholderTextColor="#666" />
            <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor="#666" />
            <TextInput style={styles.input} placeholder="CEP" placeholderTextColor="#666" keyboardType="numeric" maxLength={8} />
          </View>

          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => router.push('/profile/historico' as any)}
          >
            <Ionicons name="time" size={20} color="#010080" style={{ marginRight: 8 }} />
            <Text style={styles.historyButtonText}>Histórico de resultados do quiz</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  avatarCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  avatarImage: {
    width: 110,
    height: 110,
    resizeMode: 'contain',
  },
  changePhotoButton: {
    backgroundColor: '#FFDE59',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  changePhotoText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#010080',
  },
  whiteCard: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    width: width,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 30,
    paddingTop: 40,
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    gap: 15,
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#D9D9D9',
    height: 55,
    borderRadius: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#333',
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFDE59',
    width: '100%',
    height: 60,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#010080',
  },
});
