// OnboardingHeader.tsx

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter, usePathname } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface OnboardingHeaderProps {
  progress: number;
  onSkip?: () => void;
  showSkip?: boolean;
  initialProgress?: number;
  onBack?: () => void;
  previousProgress?: number;
}

export default function OnboardingHeader({ 
  progress, 
  onSkip, 
  showSkip = true, 
  initialProgress = 0,
  onBack,
  previousProgress = 0
}: OnboardingHeaderProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? 'light'].background;
  const textColor = Colors[colorScheme ?? 'light'].text;

  // 애니메이션 값을 위한 ref
  const animatedWidth = useRef(new Animated.Value(initialProgress * 100)).current;
  const lastProgress = useRef(initialProgress);

  useEffect(() => {
    // 진행률이 변경되지 않았다면 애니메이션을 실행하지 않음
    if (progress === lastProgress.current) {
      return;
    }

    // 이전 진행률을 저장
    lastProgress.current = progress;

    // 새로운 progress 값으로 애니메이션
    Animated.timing(animatedWidth, {
      toValue: progress * 100,
      duration: 300,
      useNativeDriver: false,
      easing: Easing.inOut(Easing.ease),
    }).start();
  }, [progress, initialProgress]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      // 뒤로가기 시 progress bar 애니메이션 효과
      const targetProgress = previousProgress;
      
      if (targetProgress !== undefined && targetProgress < progress) {
        // 매우 빠른 progress 감소 애니메이션
        Animated.timing(animatedWidth, {
          toValue: targetProgress * 100,
          duration: 120, // 충분히 빠르면서도 애니메이션이 보이는 시간
          useNativeDriver: false,
          easing: Easing.out(Easing.ease),
        }).start();
        
        // 애니메이션과 동시에 빠르게 뒤로가기
        setTimeout(() => {
          router.back();
        }, 40); // 애니메이션이 시작된 직후 바로 전환
      } else {
        // 이전 progress가 없는 경우 바로 뒤로가기
        router.back();
      }
    }
  };

  return (
    <View style={[styles.headerContainer, { backgroundColor }]}>
      <View style={styles.row}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.backIcon, { color: textColor }]}>←</Text>
        </TouchableOpacity>
        {showSkip && (
          <TouchableOpacity 
            style={styles.skipButton} 
            onPress={onSkip}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.skipText, { color: textColor }]}>スキップ</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBg}>
          <Animated.View 
            style={[
              styles.progressBar,
              {
                width: animatedWidth.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%']
                })
              }
            ]} 
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 5, // 10에서 5로 줄여서 상태바와 더 가깝게
    // borderBottomWidth: 1, // 밑줄 제거
    // borderBottomColor: '#E5E5E5', // 밑줄 제거
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 0, // 2에서 0으로 더 줄여서 상태바와 더 가깝게
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 26,
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontSize: 17,
    fontWeight: '500',
  },
  progressBarContainer: {
    paddingHorizontal: 16,
    paddingBottom: 0,
    marginTop: -4, // 음수 마진으로 더 위로 이동
  },
  progressBarBg: {
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#7F38F5', // 새로운 보라색으로 변경
    borderRadius: 2,
  },
});