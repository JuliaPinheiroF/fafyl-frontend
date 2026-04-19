import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';

export default function CursosSkeleton() {
  return (
    <View style={_styles.container}>
      <View style={_styles.searchBox}>
        <Skeleton width="100%" height={50} borderRadius={25} />
      </View>

      <View style={_styles.list}>
        {[1, 2, 3, 4, 5].map((i) => (
          <View key={i} style={_styles.card}>
            <View style={_styles.cardBody}>
              <Skeleton width="70%" height={18} />
              <Skeleton width="90%" height={13} style={{ marginTop: 8 }} />
            </View>
            <Skeleton width={24} height={24} borderRadius={12} />
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
  },
  searchBox: {
    marginTop: 20,
    marginBottom: 16,
  },
  list: {
    paddingBottom: 120,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
  },
  cardBody: {
    flex: 1,
    marginRight: 12,
  },
});