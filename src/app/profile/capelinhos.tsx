import Background from '@/components/layout/background';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { updateCapelinho, getUserCapelinho, CAPELINHO_IMAGES } from '@/services/capelinhoService';

const AVATARES = [
  { id: 1, img: CAPELINHO_IMAGES[1] },
  { id: 2, img: CAPELINHO_IMAGES[2] },
  { id: 3, img: CAPELINHO_IMAGES[3] },
  { id: 4, img: CAPELINHO_IMAGES[4] },
];

export default function SelecionarAvatar() {
  const router = useRouter();
  const [selecionado, setSelecionado] = useState(1);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getUserCapelinho().then((id) => {
      if (id) setSelecionado(id);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateCapelinho(selecionado);
    } catch (e) {
      console.error('Failed to update capelinho:', e);
    } finally {
      setSaving(false);
      router.back();
    }
  };

  return (
    <Background
      title=""
      showBackButton={true}
      onBackPress={() => router.back()}
    >
      <View style={styles.content}>
        <View style={styles.mainAvatarContainer}>
          <View style={styles.circle}>
            <Image
              source={AVATARES.find((a) => a.id === selecionado)?.img}
              style={styles.mainAvatarImage}
            />
          </View>
        </View>

        <View style={styles.whiteCard}>
          <View style={styles.grid}>
            {AVATARES.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => setSelecionado(item.id)}
                style={[
                  styles.avatarOption,
                  selecionado === item.id && styles.selectedBorder,
                ]}
              >
                <Image source={item.img} style={styles.optionImage} />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#010080" />
            ) : (
              <Text style={styles.saveButtonText}>Salvar Alterações</Text>
            )}
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
    borderColor: '#40E0D0',
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
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: { fontWeight: 'bold', fontSize: 18, color: '#000' },
});
