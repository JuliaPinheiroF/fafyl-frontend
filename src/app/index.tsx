import Background from '@/components/layout/background';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { geocodeAddress } from '@/services/geoapifyService';
import { Coordinates } from '@/types';

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cep, setCep] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanCep = cep.replace(/\D/g, '');

    if (!cleanName) {
      setError('Informe seu nome.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Informe um e-mail válido.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter ao menos 6 caracteres.');
      return;
    }
    if (cleanCep.length !== 8) {
      setError('Informe um CEP válido (8 dígitos).');
      return;
    }

    setError('');
    setLoading(true);
    try {
      let locale: Coordinates | undefined;
      try {
        const coords = await geocodeAddress(cleanCep);
        if (coords) locale = coords;
      } catch {
        locale = undefined;
      }

      await signUp({ name: cleanName, email: cleanEmail, password, locale });
      router.replace('/home' as any);
    } catch {
      setError('Não foi possível cadastrar. Verifique se o e-mail já está em uso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Background title="FAFYL">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>

        {/* Formulário Branco */}
        <View style={styles.content}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>

            <Text style={styles.title}>Cadastro</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome:</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail:</Text>
              <TextInput
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha:</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>CEP:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                maxLength={8}
                value={cep}
                onChangeText={setCep}
                editable={!loading}
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              style={styles.navlogin}
              onPress={() => router.push('/login' as any)}>
              <Text style={styles.loginText}>
                Já possui uma conta?{'  '}
                <Text style={{ fontWeight: 'bold' }}>Fazer login</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.buttonText}>Cadastrar</Text>
              )}
            </TouchableOpacity>

          </ScrollView>
        </View>

      </KeyboardAvoidingView>
    </Background>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: '#DDD',
    height: 45,
    borderRadius: 25,
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#C00',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
  },
  navlogin: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loginText: {
    color: '#666',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FFD700',
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
});