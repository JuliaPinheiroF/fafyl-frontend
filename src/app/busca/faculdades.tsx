import Background from '@/components/layout/background';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { College } from '@/types';
import { getAllColleges, getCollegeCourses } from '@/services/collegeService';
import FaculdadesSkeleton from '@/components/skeletons/FaculdadesSkeleton';
import { resolveImageUrl } from '@/utils/imageResolver';

const { width } = Dimensions.get('window');

export default function FaculdadesScreen() {
  const { courseId } = useLocalSearchParams<{ courseId?: string }>();
  const [colleges, setColleges] = useState<College[]>([]);
  const [filtered, setFiltered] = useState<College[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllColleges().then(async (data) => {
      let filteredColleges = data;

      if (courseId) {
        const id = parseInt(courseId, 10);
        const withCourse: College[] = [];
        for (const college of data) {
          const imps = await getCollegeCourses(college.id);
          if (imps.some((imp) => imp.course.id === id)) {
            withCourse.push(college);
          }
        }
        filteredColleges = withCourse;
      }

      setColleges(filteredColleges);
      setFiltered(filteredColleges);
      setLoading(false);
    });
  }, [courseId]);

  useEffect(() => {
    if (search.trim() === '') {
      setFiltered(colleges);
    } else {
      const q = search.toLowerCase();
      setFiltered(
        colleges.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q)
        )
      );
    }
  }, [search, colleges]);

  const renderCard = ({ item }: { item: College }) => {
    const imageUrl = resolveImageUrl(item.image);
    return (
      <View style={styles.card}>
        {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.cardImage} /> : null}
        <View style={styles.cardBody}>
          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={styles.cardDesc} numberOfLines={3}>
            {item.description}
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              const params: any = { id: item.id.toString() };
              if (courseId) {
                params.highlightCourseId = courseId;
              }
              router.push({ pathname: `/busca/${item.id}/faculdade`, params } as any);
            }}
          >
            <Text style={styles.buttonText}>Lista de cursos</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <Background title="FAFYL" showBackButton onBackPress={() => router.push('/busca' as any)}>
      <View style={styles.container}>
        {courseId && (
          <View style={styles.filterBanner}>
            <Ionicons name="filter" size={16} color="#010080" />
            <Text style={styles.filterText}>Mostrando faculdades com o curso selecionado</Text>
            <TouchableOpacity onPress={() => { setFiltered(colleges); setSearch(''); }} style={styles.clearFilter}>
              <Text style={styles.clearFilterText}>Limpar</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar faculdade..."
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {loading ? (
          <FaculdadesSkeleton />
        ) : filtered.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma faculdade encontrada</Text>
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
  filterBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8E8FF',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    marginBottom: 12,
    gap: 8,
  },
  filterText: {
    fontSize: 13,
    color: '#010080',
    fontWeight: '600',
    flex: 1,
  },
  clearFilter: {
    paddingHorizontal: 8,
  },
  clearFilterText: {
    fontSize: 13,
    color: '#010080',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DDD',
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 50,
    marginTop: 12,
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
    backgroundColor: '#010080',
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 20,
  },
  cardImage: {
    width: '100%',
    height: 160,
  },
  cardBody: {
    padding: 20,
  },
  cardName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 16,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#FFD700',
    borderRadius: 25,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});
