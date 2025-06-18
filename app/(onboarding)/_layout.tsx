// (onboarding)/_layout.tsx

import { Stack, usePathname, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import 'react-native-reanimated';
import OnboardingHeader from '../../components/OnboardingHeader';

// Define the progress values for each onboarding screen
const ONBOARDING_PROGRESS: { [key: string]: number } = {
  '/user-profile': 0.33,
  '/category-selection': 0.55,
  '/avatar-selection': 1.0, // 100%로 설정
};

// Define the order of onboarding screens
const ONBOARDING_ORDER = ['/user-profile', '/category-selection', '/avatar-selection'];

export default function OnboardingLayout() {
  const router = useRouter();
  const pathname = usePathname();

  // 애니메이션 관련 상태 관리
  const [currentProgress, setCurrentProgress] = useState(0);

  // pathname이 변경될 때마다 실행되는 useEffect
  useEffect(() => {
    const targetProgress = ONBOARDING_PROGRESS[pathname] || 0;
    
    // 현재 진행 상황 로깅
    console.log('Progress Update:', {
      pathname,
      currentProgress,
      targetProgress,
    });

    setCurrentProgress(targetProgress);

  }, [pathname]);

  const handleSkip = () => {
    router.replace('/home');
  };

  // 현재 페이지의 이전 progress 값 계산
  const getCurrentPreviousProgress = () => {
    const currentIndex = ONBOARDING_ORDER.indexOf(pathname);
    if (currentIndex > 0) {
      const previousPath = ONBOARDING_ORDER[currentIndex - 1];
      return ONBOARDING_PROGRESS[previousPath] || 0;
    }
    return 0;
  };

  return (
    <>
      <OnboardingHeader
        progress={currentProgress}
        onSkip={handleSkip}
        showSkip={true}
        previousProgress={getCurrentPreviousProgress()}
      />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#FFFFFF',
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 26,
    color: '#333',
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#333',
  },
  progressBarContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#7F38F5',
    borderRadius: 2,
  },
});