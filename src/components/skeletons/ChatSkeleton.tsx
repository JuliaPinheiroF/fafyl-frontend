import React from 'react';
import { StyleSheet, View } from 'react-native';
import Skeleton from './Skeleton';

export default function ChatSkeleton() {
  return (
    <View style={styles.messages}>
      <View style={styles.messageRowBot}>
        <View style={styles.skeletonAvatar} />
        <Skeleton width={200} height={40} borderRadius={16} />
      </View>

      <View style={styles.messageRowUser}>
        <Skeleton width={150} height={36} borderRadius={16} />
      </View>

      <View style={styles.messageRowBot}>
        <View style={styles.skeletonAvatar} />
        <Skeleton width={180} height={40} borderRadius={16} />
      </View>

      <View style={styles.messageRowBot}>
        <View style={styles.skeletonAvatar} />
        <Skeleton width={220} height={44} borderRadius={16} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  messages: {
    padding: 16,
    gap: 12,
  },
  messageRowBot: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    alignSelf: 'flex-start',
  },
  messageRowUser: {
    alignSelf: 'flex-end',
  },
  skeletonAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
  },
});
