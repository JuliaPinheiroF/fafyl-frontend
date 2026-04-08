import Background from '@/components/layout/background';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
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
import { getAllColleges } from '@/services/collegeService';

const { width } = Dimensions.get('window');

export default function FaculdadesScreen() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [filtered, setFiltered] = useState<College[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllColleges().then((data) => {
      setColleges(data);
      setFiltered(data);
      setLoading(false);
    });
  }, []);

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

  const renderCard = ({ item }: { item: College }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardBody}>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardDesc} numberOfLines={3}>
          {item.description}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push(`/busca/${item.id}/faculdade` as any)}
        >
          <Text style={styles.buttonText}>Lista de cursos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Background title="FAFYL" showBackButton onBackPress={() => router.back()}>
      <View style={styles.container}>
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
          <ActivityIndicator size="large" color="#010080" style={styles.loader} />
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
