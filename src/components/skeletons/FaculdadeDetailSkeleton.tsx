import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';

const NUM_COURSES = 4;

export default function FaculdadeDetailSkeleton() {
  return (
    <View style={_styles.container}>
      <Skeleton width="100%" height={180} borderRadius={25} />

      <View style={_styles.headerBody}>
        <Skeleton width="80%" height={24} />
        <Skeleton width="100%" height={14} style={{ marginTop: 8 }} />
        <Skeleton width="60%" height={14} style={{ marginTop: 4 }} />
      </View>

      <Skeleton width={180} height={18} style={{ marginTop: 16 }} />

      <View style={_styles.courses}>
        {Array.from({ length: NUM_COURSES }).map((_, i) => (
          <View key={i} style={_styles.courseCard}>
            <View style={_styles.courseBody}>
              <Skeleton width="70%" height={16} />
              <Skeleton width="90%" height={13} style={{ marginTop: 4 }} />
            </View>
            <Skeleton width={22} height={22} borderRadius={11} />
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
    paddingTop: 10,
  },
  headerBody: {
    marginTop: 20,
    marginBottom: 20,
  },
  courses: {
    paddingBottom: 120,
  },
  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  courseBody: {
    flex: 1,
    marginRight: 10,
  },
});