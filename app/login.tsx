import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect } from 'react';
import { Alert, Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

WebBrowser.maybeCompleteAuthSession();

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '592113992663-dplmoe6qc8sun9c8d6etlk7bvtfjcoc4.apps.googleusercontent.com',
    iosClientId: '592113992663-sp53u84ljdmogjhpfnd111p5s2mt6gtu.apps.googleusercontent.com',
    androidClientId: '592113992663-dplmoe6qc8sun9c8d6etlk7bvtfjcoc4.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      // 구글 로그인 성공 처리
      console.log(authentication);
      router.replace('/(onboarding)/user-profile');
    }
  }, [response]);

  const handleGoogleLogin = async () => {
    try {
      await promptAsync();
    } catch (error: any) {
      Alert.alert('エラー', 'Googleログインに失敗しました。');
    }
  };

  const handleAppleLogin = () => {
    router.replace('/(onboarding)/user-profile');
  };

  const handleSkipLogin = () => {
    router.push('/(onboarding)/user-profile');
  };

  return (
    <SafeAreaView style={[
      styles.container, 
      { backgroundColor: Colors[colorScheme ?? 'light'].background }
    ]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <View style={styles.contentContainer}>
        {/* Japanese text that says "Enjoy memorization" */}
        <Text style={[
          styles.topText, 
          { color: Colors[colorScheme ?? 'light'].text }
        ]}>
          楽しく暗記を
        </Text>
        
        {/* Logo with text */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>
            <Text style={styles.logoTextBlack}>フリップ</Text>
            <Text style={styles.logoTextPurple}>GO</Text>
          </Text>
        </View>
        
        {/* Mascot character */}
        <View style={styles.characterContainer}>
          <Image 
            source={require('../assets/images/mascot.png')} 
            style={styles.character}
            resizeMode="contain"
          />
        </View>
      </View>
      
      {/* Login buttons */}
      <View style={styles.buttonContainer}>
        {/* Google Login Button */}
        <TouchableOpacity 
          style={[styles.loginButton, styles.googleButton]} 
          onPress={handleGoogleLogin}
        >
          <View style={styles.buttonContent}>
            <Image 
              source={require('../assets/images/google-icon.png')} 
              style={styles.buttonIcon}
            />
            <Text style={styles.googleButtonText}>Googleでログイン</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.loginButton, styles.appleButton]} 
          onPress={handleAppleLogin}
        >
          <View style={styles.buttonContent}>
            <Image 
              source={require('../assets/images/apple-icon.png')} 
              style={styles.buttonIcon}
            />
            <Text style={styles.appleButtonText}>Appleでログイン</Text>
          </View>
        </TouchableOpacity>
        
        {/* Skip Login Option */}
        <TouchableOpacity 
          style={styles.skipButton} 
          onPress={handleSkipLogin}
        >
          <Text style={[
            styles.skipButtonText, 
            { color: Colors[colorScheme ?? 'light'].text }
          ]}>
            ログインしない
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  topText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  logoTextBlack: {
    color: '#000',
  },
  logoTextPurple: {
    color: '#7B61FF',
  },
  characterContainer: {
    width: width * 0.5,
    height: width * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  character: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    width: '90%',
    paddingHorizontal: 20,
  },
  loginButton: {
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  googleButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  appleButton: {
    backgroundColor: '#000',
  },
  googleButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  appleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  skipButton: {
    marginTop: 10,
    padding: 10,
  },
  skipButtonText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
