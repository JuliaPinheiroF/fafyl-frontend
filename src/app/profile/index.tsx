import Background from '@/components/layout/background';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { getCapelinhoImage } from '@/services/capelinhoService';
import { getMe, updateCoordinates } from '@/services/authService';
import { geocodeAddress, reverseGeocode } from '@/services/geoapifyService';
import { useAuth } from '@/context/AuthContext';
import { formatCep, isValidCep, onlyDigits } from '@/utils/cep';

const { width } = Dimensions.get('window');

export default function Profile() {
  const router = useRouter();
  const { token, signOut } = useAuth();
  const [capelinhoId, setCapelinhoId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cep, setCep] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageKind, setMessageKind] = useState<'success' | 'error'>('success');

  useFocusEffect(
    useCallback(() => {
      if (!token) {
        setCapelinhoId(null);
        setName('');
        setEmail('');
        setCep('');
        setLoading(false);
        return;
      }

      let active = true;
      setLoading(true);
      setMessage('');

      (async () => {
        const me = await getMe();
        if (!active) return;
        if (me) {
          setName(me.name ?? '');
          setEmail(me.email ?? '');
          setCapelinhoId(me.capelinho ?? null);
          if (me.locale?.lat != null && me.locale?.lon != null) {
            try {
              const storedCep = await reverseGeocode(me.locale.lat, me.locale.lon);
              if (active && storedCep) setCep(formatCep(storedCep));
            } catch {
              // CEP não resolvido, campo fica em branco
            }
          }
        } else {
          setCapelinhoId(null);
          setName('');
          setEmail('');
          setCep('');
        }
        if (active) setLoading(false);
      })();

      return () => {
        active = false;
      };
    }, [token])
  );

  const avatarImage = getCapelinhoImage(capelinhoId);

  const handleSave = async () => {
    if (!isValidCep(cep)) {
      setMessageKind('error');
      setMessage('Informe um CEP válido (8 dígitos).');
      return;
    }

    setSaving(true);
    setMessage('');
    try {
      const locale = await geocodeAddress(onlyDigits(cep));
      if (!locale) {
        setMessageKind('error');
        setMessage('Não foi possível localizar esse CEP.');
        return;
      }
      const updated = await updateCoordinates(locale.lat, locale.lon);
      if (!updated) {
        setMessageKind('error');
        setMessage('Falha ao salvar. Tente novamente.');
        return;
      }
      setMessageKind('success');
      setMessage('Dados atualizados com sucesso!');
    } catch {
      setMessageKind('error');
      setMessage('Falha ao salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.replace('/login' as any);
  };

  if (loading) {
    return (
      <Background title="Meu Perfil" centerTitle showBackButton onBackPress={() => router.back()}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#010080" />
        </View>
      </Background>
    );
  }

  if (!token) {
    return (
      <Background
        title="Meu Perfil"
        titleSize={30}
        centerTitle
        showBackButton
        onBackPress={() => router.back()}
      >
        <View style={styles.unauthenticated}>
          <Image source={avatarImage} style={styles.unauthenticatedImage} />
          <Text style={styles.unauthenticatedTitle}>Você ainda não entrou</Text>
          <Text style={styles.unauthenticatedText}>
            Entre ou cadastre-se para acessar seu perfil, personalizar seu Capelinho e ver seu histórico.
          </Text>
          <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/login' as any)}>
            <Text style={styles.loginButtonText}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </Background>
    );
  }

  return (
    <Background
      title="Meu Perfil"
      titleSize={30}
      centerTitle
      showBackButton
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
            <Text style={styles.inputLabel}>Nome</Text>
            <TextInput style={styles.input} value={name} editable={false} placeholder="Nome" placeholderTextColor="#999" />

            <Text style={styles.inputLabel}>E-mail</Text>
            <TextInput style={styles.input} value={email} editable={false} placeholder="E-mail" placeholderTextColor="#999" />

            <Text style={styles.inputLabel}>CEP</Text>
            <TextInput
              style={styles.input}
              value={cep}
              onChangeText={(value) => setCep(formatCep(value))}
              placeholder="CEP"
              placeholderTextColor="#999"
              keyboardType="numeric"
              maxLength={9}
            />
          </View>

          {message ? (
            <Text style={[styles.messageText, messageKind === 'success' ? styles.successText : styles.errorText]}>
              {message}
            </Text>
          ) : null}

          <TouchableOpacity
            style={[styles.saveButton, saving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#010080" />
            ) : (
              <Text style={styles.saveButtonText}>Salvar alterações</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => router.push('/profile/historico' as any)}
          >
            <Ionicons name="time" size={20} color="#010080" style={{ marginRight: 8 }} />
            <Text style={styles.historyButtonText}>Histórico de resultados do quiz</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#C00" style={{ marginRight: 8 }} />
            <Text style={styles.logoutButtonText}>Sair da conta</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unauthenticated: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    width: width,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 80,
  },
  unauthenticatedImage: {
    width: 110,
    height: 110,
    marginBottom: 20,
  },
  unauthenticatedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#010080',
    marginBottom: 8,
  },
  unauthenticatedText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: '#FFDE59',
    width: '100%',
    height: 55,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#010080',
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
    paddingTop: 20,
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 6,
  },
  inputLabel: {
    fontSize: 13,
    color: '#666',
    marginLeft: 10,
    marginBottom: 4,
    marginTop: 6,
  },
  input: {
    backgroundColor: '#D9D9D9',
    height: 55,
    borderRadius: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#333',
  },
  messageText: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 8,
  },
  successText: {
    color: '#2E7D32',
  },
  errorText: {
    color: '#C00',
  },
  saveButton: {
    backgroundColor: '#FFDE59',
    width: '100%',
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#010080',
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
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 50,
    marginTop: 18,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C00',
  },
});