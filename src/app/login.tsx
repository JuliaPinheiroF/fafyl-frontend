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
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Cabeçalho Azul */}
        <View style={styles.header}>
          <Text style={styles.logoText}>FAFYL</Text>
        </View>

        {/* Formulário Branco */}
        <View style={styles.content}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Login</Text>

            {/* Campo E-mail */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail:</Text>
              <TextInput 
                style={styles.input} 
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Campo Senha */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha:</Text>
              <TextInput 
                style={styles.input} 
                secureTextEntry={true} 
              />
            </View>

            <TouchableOpacity 
              style={styles.linkButton} 
              onPress={() => router.replace('/cadastro')}
            >
              <Text style={styles.linkText}>
                Não tem uma conta? <Text style={styles.linkBold}>Cadastre-se</Text>
              </Text>
            </TouchableOpacity>

            {/* Botão Entrar */}
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Entrar</Text>
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
    backgroundColor: '#00008B',
  },
  header: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 40,
    fontWeight: '900',
    color: '#FFD700',
  },
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