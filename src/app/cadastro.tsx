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
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
          
        {/* Cabeçalho Azul */}
        <View style={styles.header}>
          <Text style={styles.logoText}>FAFYL</Text>
        </View>

        {/* Formulário Branco */}
        <View style={styles.formContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
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
              <TextInput style={styles.input} secureTextEntry={true} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>CEP:</Text>
              <TextInput style={styles.input} keyboardType="numeric" />
            </View>

            <TouchableOpacity style={styles.loginLink}>
              <Text style={styles.loginLinkText}>Já possui uma conta?</Text>
              <Text style={[styles.loginLinkText, { fontWeight: 'bold' }]}>Fazer login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00008B', // Azul do fundo
  },
  header: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 40,
    fontWeight: '900',
    color: '#FFD700', // Cor do FAFYL
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5', // Fundo quase branco/cinza claro
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 30,
    paddingTop: 20,
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
    backgroundColor: '#DDD', // Cinza dos campos
    height: 45,
    borderRadius: 25,
    paddingHorizontal: 20,
  },
  loginLink: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loginLinkText: {
    color: '#666',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FFD700', // Amarelo do botão
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