import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';

export default function FaculdadesSkeleton() {
  return (
    <View style={_styles.container}>
      <View style={_styles.searchBox}>
        <Skeleton width="100%" height={50} borderRadius={25} />
      </View>

      <View style={_styles.list}>
        {[1, 2, 3].map((i) => (
          <View key={i} style={_styles.card}>
            <Skeleton width="100%" height={100} borderRadius={0} />
            <View style={_styles.cardBody}>
              <Skeleton width="70%" height={16} />
              <Skeleton width="90%" height={12} style={{ marginTop: 8 }} />
              <Skeleton width="50%" height={12} style={{ marginTop: 6 }} />
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
  },
  searchBox: {
    marginTop: 20,
    marginBottom: 16,
  },
  list: {
    paddingBottom: 120,
  },
  card: {
    backgroundColor: '#E0E0E0',
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 20,
  },
  cardBody: {
    padding: 16,
  },
});