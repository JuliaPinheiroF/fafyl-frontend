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

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Preencha e-mail e senha.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signIn(email.trim().toLowerCase(), password);
      router.replace('/home' as any);
    } catch {
      setError('E-mail ou senha inválidos.');
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
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

            <Text style={styles.title}>Login</Text>

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

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => router.replace('/')}>
              <Text style={styles.linkText}>
                Não tem uma conta? <Text style={styles.linkBold}>Cadastre-se</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
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
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    marginLeft: 10,
  },
  input: {
    backgroundColor: '#DDD',
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
  },
  errorText: {
    color: '#C00',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
  },
  linkButton: {
    alignItems: 'center',
    marginVertical: 20,
  },
  linkText: {
    fontSize: 16,
    color: '#666',
  },
  linkBold: {
    fontWeight: 'bold',
    color: '#000',
  },
  button: {
    backgroundColor: '#FFD700',
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
});