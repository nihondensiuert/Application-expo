import { Image } from 'expo-image';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Text, View } from 'react-native';


import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            height: 90, // ← 高さを拡張
            paddingBottom: 20, // ← 必要に応じて下余白も追加
          },
          android: {
            height: 90,
            paddingBottom: 20,
          },
          default: {
            height: 90,
            paddingBottom: 20,
          },
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'ホーム',
          tabBarLabelPosition: 'below-icon',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'flex-end', width: 80, height: 90 }}>
              <Image
                source={require('@/assets/images/Homeicon.svg')}
                style={{ width: 20, height: 22, marginBottom: 6 }}
                contentFit="cover"
              />
              <Text style={{ fontSize: 12, color: color, marginTop: 0, fontWeight: focused ? 'bold' : 'normal' }}>
                ホーム
              </Text>
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="classroom"
        options={{
          title: 'クラスルーム',
          tabBarLabelPosition: 'below-icon',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'flex-end', width: 100, height: 90 }}>
              <Image
                source={require('@/assets/images/Classroomicon.svg')}
                style={{ width: 20, height: 22, marginBottom: 6 }}
                contentFit="cover"
              />
              <Text
                style={{
                  fontSize: 12,
                  color: color,
                  marginTop: 0,
                  fontWeight: focused ? 'bold' : 'normal',
                  letterSpacing: -1,
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                クラスルーム
              </Text>
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{
          title: 'マイページ',
          tabBarLabelPosition: 'below-icon',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'flex-end', width: 80, height: 90 }}>
              <Image
                source={require('@/assets/images/Mypageicon.svg')}
                style={{ width: 20, height: 20, marginBottom: 6 }}
                contentFit="cover"
              />
              <Text style={{ fontSize: 12, color: color, marginTop: 0, fontWeight: focused ? 'bold' : 'normal' }}>
                マイページ
              </Text>
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
    </Tabs>
  );
}
