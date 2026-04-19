import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';

const NUM_TAGS = 4;
const NUM_IMPS = 3;

export default function CursoDetailSkeleton() {
  return (
    <View style={_styles.container}>
      <View style={_styles.header}>
        <Skeleton width="80%" height={24} />
        <Skeleton width="100%" height={14} style={{ marginTop: 6 }} />
      </View>

      <View style={_styles.section}>
        <Skeleton width={100} height={16} />
        <View style={_styles.tagsRow}>
          {Array.from({ length: NUM_TAGS }).map((_, i) => (
            <Skeleton
              key={i}
              width={70}
              height={28}
              borderRadius={20}
            />
          ))}
        </View>
      </View>

      <View style={_styles.section}>
        <Skeleton width={120} height={16} />
        <View style={_styles.tagsRow}>
          {Array.from({ length: NUM_TAGS }).map((_, i) => (
            <Skeleton
              key={i}
              width={90}
              height={28}
              borderRadius={20}
            />
          ))}
        </View>
      </View>

      <Skeleton width={200} height={16} style={{ marginTop: 8 }} />

      <View style={_styles.imps}>
        {Array.from({ length: NUM_IMPS }).map((_, i) => (
          <View key={i} style={_styles.impCard}>
            <View style={_styles.impHeader}>
              <View style={_styles.impInfo}>
                <Skeleton width="60%" height={16} />
                <Skeleton width="40%" height={15} style={{ marginTop: 2 }} />
              </View>
              <Skeleton width={22} height={22} borderRadius={11} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const _styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 25,
    paddingTop: 20,
  },
  header: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 8,
  },
  imps: {
    paddingBottom: 120,
  },
  impCard: {
    backgroundColor: '#E0E0E0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  impHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  impInfo: {
    flex: 1,
  },
});