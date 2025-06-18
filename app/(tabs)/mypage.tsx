import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function MyPageScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>マイページ</Text>
        <Text style={styles.subtitle}>Coming Soon...</Text>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push('/home')}
        >
          <Image
            source={require('../../assets/images/home-icon-gray.png')}
            style={styles.navIcon}
          />
          <Text style={styles.navTextInactive}>ホーム</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/(tabs)/classroom')}
        >
          <Image
            source={require('../../assets/images/graduation-icon-gray.png')}
            style={styles.navIcon}
          />
          <Text style={styles.navTextInactive}>クラスルーム</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image
            source={require('../../assets/images/user-icon.png')}
            style={styles.navIcon}
          />
          <Text style={styles.navTextActive}>マイページ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  navIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  navTextActive: {
    fontSize: 12,
    color: '#7F38F5',
    fontWeight: '500',
  },
  navTextInactive: {
    fontSize: 12,
    color: '#999',
  },
});