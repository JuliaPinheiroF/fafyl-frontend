import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CourseCategory } from '@/types';

const CATEGORIES: { value: CourseCategory; label: string }[] = [
  { value: 'EXATAS', label: 'Exatas' },
  { value: 'SAUDE', label: 'Saúde' },
  { value: 'HUMANAS', label: 'Humanas' },
  { value: 'CRIATIVAS', label: 'Criativas' },
  { value: 'COMUNICACAO', label: 'Comunicação' },
];

const DISTANCES: { value: number; label: string }[] = [
  { value: 0, label: 'Qualquer' },
  { value: 5000, label: '5 km' },
  { value: 10000, label: '10 km' },
  { value: 25000, label: '25 km' },
  { value: 50000, label: '50 km' },
  { value: 100000, label: '100 km' },
];

const SORT_OPTIONS = [
  { value: 'name', label: 'Nome' },
  { value: 'fees', label: 'Mensalidade' },
];

interface FilterBarProps {
  showCategory?: boolean;
  showDistance?: boolean;
  showFees?: boolean;
  category?: string;
  onCategoryChange?: (v: string) => void;
  minFees?: number;
  maxFees?: number;
  onMinFeesChange?: (v: number) => void;
  onMaxFeesChange?: (v: number) => void;
  maxDistance?: number;
  onMaxDistanceChange?: (v: number) => void;
  sortBy?: string;
  direction?: 'asc' | 'desc';
  onSortChange?: (by: string, dir: 'asc' | 'desc') => void;
}

export default function FilterBar({
  showCategory,
  showDistance,
  showFees,
  category,
  onCategoryChange,
  minFees,
  maxFees,
  onMinFeesChange,
  onMaxFeesChange,
  maxDistance,
  onMaxDistanceChange,
  sortBy,
  direction,
  onSortChange,
}: FilterBarProps) {
  const [open, setOpen] = useState(false);
  const hasActive = !!(category || maxDistance || minFees);

  const clear = () => {
    onCategoryChange?.('');
    onMinFeesChange?.(0);
    onMaxFeesChange?.(2000);
    onMaxDistanceChange?.(0);
    onSortChange?.('name', 'asc');
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.toggle}
        onPress={() => setOpen(!open)}
        activeOpacity={0.7}
      >
        <Ionicons name="filter" size={16} color="#010080" />
        <Text style={styles.toggleText}>Filtros</Text>
        {hasActive && <View style={styles.badge} />}
      </TouchableOpacity>

      {open && (
        <View style={styles.panel}>
          <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
            {showDistance && (
              <View style={styles.section}>
                <Text style={styles.label}>Distância máxima</Text>
                <View style={styles.chips}>
                  {DISTANCES.map((d) => (
                    <TouchableOpacity
                      key={d.value}
                      style={[styles.chip, (maxDistance ?? 0) === d.value && styles.chipActive]}
                      onPress={() => onMaxDistanceChange?.(d.value)}
                      activeOpacity={0.7}
                    >
                      <Text style={[(maxDistance ?? 0) === d.value ? styles.chipTextActive : styles.chipText]}>
                        {d.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {showCategory && (
              <View style={styles.section}>
                <Text style={styles.label}>Área</Text>
                <View style={styles.chips}>
                  {CATEGORIES.map((c) => (
                    <TouchableOpacity
                      key={c.value}
                      style={[styles.chip, category === c.value && styles.chipActive]}
                      onPress={() => onCategoryChange?.(category === c.value ? '' : c.value)}
                      activeOpacity={0.7}
                    >
                      <Text style={[category === c.value ? styles.chipTextActive : styles.chipText]}>
                        {c.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {onSortChange && (
              <View style={styles.section}>
                <Text style={styles.label}>Ordenar por</Text>
                <View style={styles.row}>
                  {SORT_OPTIONS.map((o) => (
                    <TouchableOpacity
                      key={o.value}
                      style={[styles.sortOption, (sortBy ?? 'name') === o.value && styles.chipActive]}
                      onPress={() => onSortChange(o.value, direction ?? 'asc')}
                      activeOpacity={0.7}
                    >
                      <Text style={[(sortBy ?? 'name') === o.value ? styles.chipTextActive : styles.chipText]}>
                        {o.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    style={styles.directionBtn}
                    onPress={() => onSortChange(sortBy ?? 'name', direction === 'asc' ? 'desc' : 'asc')}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={direction === 'asc' ? 'arrow-up' : 'arrow-down'}
                      size={16}
                      color="#010080"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {showFees && (
              <View style={styles.section}>
                <Text style={styles.label}>
                  Mensalidade: R$ {minFees ?? 0} - R$ {maxFees ?? 2000}
                </Text>
                <View style={styles.row}>
                  <TouchableOpacity
                    style={styles.directionBtn}
                    onPress={() => onMinFeesChange?.(Math.max(0, (minFees ?? 0) - 200))}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="remove" size={16} color="#010080" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.directionBtn}
                    onPress={() => onMinFeesChange?.(Math.min(2000, (minFees ?? 0) + 200))}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="add" size={16} color="#010080" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {hasActive && (
              <TouchableOpacity style={styles.clearBtn} onPress={clear} activeOpacity={0.7}>
                <Text style={styles.clearText}>Limpar filtros</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E8E8FF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#010080',
  },
  badge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#010080',
  },
  panel: {
    backgroundColor: '#F1F1FF',
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
  },
  section: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#555',
    marginBottom: 8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  chipActive: {
    backgroundColor: '#010080',
    borderColor: '#010080',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
  },
  chipTextActive: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sortOption: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  directionBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DDD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  clearText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#010080',
  },
});