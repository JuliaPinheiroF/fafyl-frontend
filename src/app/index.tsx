import Background from '@/components/layout/background';
import { router } from 'expo-router';
import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function App() {
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
              <TextInput style={styles.input} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail:</Text>
              <TextInput style={styles.input} keyboardType="email-address" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha:</Text>
              <TextInput style={styles.input} secureTextEntry />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>CEP:</Text>
              <TextInput style={styles.input} keyboardType="numeric" />
            </View>

            <TouchableOpacity
              style={styles.navlogin}
              onPress={() => router.push('/login' as any)}>
              <Text style={styles.loginText}>
                Já possui uma conta?{'  '}
                <Text style={{ fontWeight: 'bold' }}>Fazer login</Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Cadastrar</Text>
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