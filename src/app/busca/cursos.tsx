import Background from '@/components/layout/background';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Course } from '@/types';
import { getAllCourses } from '@/services/courseService';

const { width } = Dimensions.get('window');

export default function CursosScreen() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filtered, setFiltered] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllCourses().then((data) => {
      setCourses(data);
      setFiltered(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (search.trim() === '') {
      setFiltered(courses);
    } else {
      const q = search.toLowerCase();
      setFiltered(
        courses.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q)
        )
      );
    }
  }, [search, courses]);

  const renderCard = ({ item }: { item: Course }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/busca/${item.id}/curso` as any)}
    >
      <View style={styles.cardBody}>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardDesc} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#010080" />
    </TouchableOpacity>
  );

  return (
    <Background title="FAFYL" showBackButton onBackPress={() => router.back()}>
      <View style={styles.container}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar curso..."
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#010080" style={styles.loader} />
        ) : filtered.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum curso encontrado</Text>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCard}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
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
    paddingHorizontal: 25,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DDD',
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 50,
    marginTop: 20,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  loader: { marginTop: 60 },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 60,
  },
  list: {
    paddingBottom: 120,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardBody: {
    flex: 1,
    marginRight: 12,
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#010080',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: '#666',
  },
});
