import Background from '@/components/layout/background';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { HistoryEntry, getHistory, formatDate } from '@/services/historyService';

const { width } = Dimensions.get('window');

export default function HistoricoScreen() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory().then((data) => {
      setHistory(data);
      setLoading(false);
    });
  }, []);

  const handleViewCourse = (courseId: number) => {
    router.push(`/busca/${courseId}/curso` as any);
  };

  if (loading) {
    return (
      <Background title="FAFYL" showBackButton onBackPress={() => router.back()}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando histórico...</Text>
        </View>
      </Background>
    );
  }

  if (history.length === 0) {
    return (
      <Background title="FAFYL" showBackButton onBackPress={() => router.back()}>
        <View style={styles.emptyContainer}>
          <Ionicons name="clipboard-outline" size={64} color="#CCC" />
          <Text style={styles.emptyTitle}>Nenhum resultado ainda</Text>
          <Text style={styles.emptyText}>
            Faça o quiz para receber recomendações de cursos.
          </Text>
          <TouchableOpacity
            style={styles.quizButton}
            onPress={() => router.push('/quiz' as any)}
          >
            <Text style={styles.quizButtonText}>Fazer quiz</Text>
          </TouchableOpacity>
        </View>
      </Background>
    );
  }

  return (
    <Background title="FAFYL" showBackButton onBackPress={() => router.back()}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Histórico de Resultados</Text>
        <Text style={styles.headerSubtitle}>
          {history.length} resultado{history.length > 1 ? 's' : ''} encontrado{history.length > 1 ? 's' : ''}
        </Text>

        <FlatList
          data={history}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.historyCard}
              onPress={() => handleViewCourse(item.course.id)}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <View style={styles.courseIcon}>
                  <Ionicons name="book" size={24} color="#FFD700" />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.courseName}>{item.course.name}</Text>
                  <Text style={styles.courseDate}>{formatDate(item.accessedAt)}</Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color="#010080" />
              </View>
              <Text style={styles.courseDesc} numberOfLines={2}>
                {item.course.description}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    width: width,
    marginTop: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#010080',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  quizButton: {
    backgroundColor: '#FFDE59',
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 32,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  quizButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#010080',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#010080',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  listContent: {
    paddingHorizontal: 25,
    paddingBottom: 120,
  },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#010080',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#010080',
    marginBottom: 2,
  },
  courseDate: {
    fontSize: 12,
    color: '#999',
  },
  courseDesc: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginLeft: 56,
  },
});
