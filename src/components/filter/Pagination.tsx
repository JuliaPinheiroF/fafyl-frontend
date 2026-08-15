import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PaginationProps {
  current: number;
  total: number;
  onChange: (page: number) => void;
}

export default function Pagination({ current, total, onChange }: PaginationProps) {
  if (total <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(0, Math.min(current - 2, total - 5));
  const end = Math.min(total, start + 5);
  for (let i = start; i < end; i++) pages.push(i);

  const canPrev = current > 0;
  const canNext = current < total - 1;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, !canPrev && styles.disabled]}
        disabled={!canPrev}
        onPress={() => onChange(current - 1)}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={16} color={canPrev ? '#010080' : '#BBB'} />
      </TouchableOpacity>

      {pages.map((p) => (
        <TouchableOpacity
          key={p}
          style={[styles.button, p === current && styles.activeButton]}
          onPress={() => onChange(p)}
          activeOpacity={0.7}
        >
          <Text style={[styles.pageText, p === current && styles.activeText]}>{p + 1}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.button, !canNext && styles.disabled]}
        disabled={!canNext}
        onPress={() => onChange(current + 1)}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-forward" size={16} color={canNext ? '#010080' : '#BBB'} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
  },
  button: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: '#010080',
    borderColor: '#010080',
  },
  disabled: {
    opacity: 0.4,
  },
  pageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  activeText: {
    color: '#fff',
  },
});