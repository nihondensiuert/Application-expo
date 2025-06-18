import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function MainScreen() {
  const router = useRouter();

  useEffect(() => {
    // 앱 시작 시 로그인 화면으로 리다이렉트
    router.replace('/login');
  }, []);

  return null; // 리다이렉트만 하므로 UI는 표시하지 않음
}
