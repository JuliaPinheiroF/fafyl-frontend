import Background from '@/components/layout/background';
import FilterBar from '@/components/filter/FilterBar';
import Pagination from '@/components/filter/Pagination';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Course } from '@/types';
import { getAllCourses, getCoursesFiltered } from '@/services/courseService';
import CursosSkeleton from '@/components/skeletons/CursosSkeleton';

const { width } = Dimensions.get('window');
const ITEMS_PER_PAGE = 20;
const SEARCH_PAGE_SIZE = 50;

export default function CursosScreen() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [serverResults, setServerResults] = useState<Course[]>([]);
  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [direction, setDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);

  const searchSeq = useRef(0);

  useEffect(() => {
    getAllCourses().then((data) => {
      setCourses(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setPage(0);
    const q = search.trim().toLowerCase();
    if (!q) {
      setSearching(false);
      setServerResults([]);
      return;
    }

    setSearching(true);
    setServerResults([]);
    const seq = ++searchSeq.current;

    (async () => {
      const matches: Course[] = [];
      let pageNum = 0;
      let pages = Infinity;
      let guard = 0;

      while (pageNum < pages && guard < 500) {
        guard++;
        const res = await getCoursesFiltered({
          page: pageNum,
          size: SEARCH_PAGE_SIZE,
          category: category || undefined,
          sortBy: 'name',
          direction: 'asc',
        });
        if (searchSeq.current !== seq) return;

        pages = res.totalPages;
        const part = res.content.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q)
        );
        matches.push(...part);
        pageNum++;
      }

      if (searchSeq.current !== seq) return;
      setServerResults(matches);
      setSearching(false);
    })();
  }, [search, category]);

  useEffect(() => {
    setPage(0);
  }, [sortBy, direction]);

  const base = search.trim() ? serverResults : courses;
  const filtered = base.filter((c) => (category ? c.category === category : true));

  filtered.sort((a, b) => {
    const dir = direction === 'desc' ? -1 : 1;
    if (sortBy === 'name') return dir * a.name.localeCompare(b.name);
    return dir * (a.id - b.id);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const displayList = filtered.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

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
    <Background title="FAFYL" showBackButton onBackPress={() => router.push('/busca')}>
      <View style={styles.container}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar curso..."
            value={search}
            onChangeText={(t) => {
              setSearch(t);
              setPage(0);
            }}
          />
        </View>

        <FilterBar
          showCategory
          category={category}
          onCategoryChange={(v) => setCategory(v)}
          sortBy={sortBy}
          direction={direction}
          onSortChange={(by, dir) => {
            setSortBy(by);
            setDirection(dir);
          }}
        />

        {loading ? (
          <CursosSkeleton />
        ) : searching ? (
          <Text style={styles.searchingText}>Procurando o curso em todas as páginas...</Text>
        ) : displayList.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum curso encontrado</Text>
        ) : (
          <FlatList
            data={displayList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCard}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              <Pagination current={page} total={totalPages} onChange={setPage} />
            }
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
  searchingText: {
    textAlign: 'center',
    fontSize: 15,
    color: '#666',
    marginTop: 50,
  },
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