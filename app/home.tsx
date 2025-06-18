import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();

  const handleQuickStart = () => {
    router.push('/problem-room');
  };

  const handleStudyStart = () => {
    router.push('/(tabs)/study');
  };

  return (
    <>
      <View style={styles.backgroundFill} />
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>LV 1</Text>
          </View>
          <Text style={styles.userName}>のりものここ</Text>
          <Text style={styles.startDate}>2025.12.12から始めました。</Text>
        </View>

        {/* Character Section */}
        <View style={styles.characterSection}>
          <View style={styles.characterContainer}>
            {/* Main Character Image */}
            <Image 
              source={require('../assets/images/main-character.png')} 
              style={styles.characterImage}
            />
          </View>
          
          {/* Purple Platform */}
          <View style={styles.platform} />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.quickStartButton} onPress={handleQuickStart}>
            <View style={styles.buttonContent}>
              <View style={styles.buttonTextTop}>
                <Text style={styles.buttonSubtitle}>今すぐしたい</Text>
                <Text style={styles.buttonSubtitle}>時は</Text>
              </View>
              <View style={styles.buttonBottom}>
                <Text style={styles.buttonTitle}>早速始め</Text>
                <Text style={styles.buttonArrow}>›</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.studyButton} onPress={handleStudyStart}>
            <View style={styles.buttonContent}>
              <View style={styles.buttonTextTop}>
                <Text style={styles.buttonSubtitle}>一から十まで</Text>
                <Text style={styles.buttonSubtitle}>準備して</Text>
              </View>
              <View style={styles.buttonBottom}>
                <Text style={styles.buttonTitle}>自習勉強</Text>
                <Text style={styles.buttonArrow}>›</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <Image
              source={require('../assets/images/home-icon.png')}
              style={styles.navIcon}
            />
            <Text style={styles.navTextActive}>ホーム</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Image
              source={require('../assets/images/graduation-icon-gray.png')}
              style={styles.navIcon}
            />
            <Text style={styles.navTextInactive}>クラスルーム</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Image
              source={require('../assets/images/user-icon-gray.png')}
              style={styles.navIcon}
            />
            <Text style={styles.navTextInactive}>マイページ</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  backgroundFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF', // 흰색으로 변경
    zIndex: -1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  levelBadge: {
    backgroundColor: '#7F38F5',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 16,
  },
  levelText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  startDate: {
    fontSize: 14,
    color: '#666',
  },
  characterSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  characterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 80, // 플랫폼과의 간격 증가
    zIndex: 2, // 플랫폼보다 앞에 배치
  },
  characterImage: {
    width: width * 0.6,
    height: width * 0.8,
    resizeMode: 'contain',
    zIndex: 2, // 확실히 앞에 배치
  },
  platform: {
    position: 'absolute',
    bottom: -45,
    width: width,
    height: width * 0.5,
    backgroundColor: '#7F38F5',
    borderTopLeftRadius: width * 1,
    borderTopRightRadius: width * 1,
    borderBottomLeftRadius: width * 0.4, // 왼쪽 아래 라운드 추가
    borderBottomRightRadius: width * 0.4, // 오른쪽 아래 라운드 추가
    transform: [{ scaleX: 1.2 }],
    marginBottom: 40,
    zIndex: 1, // 캐릭터보다 뒤에 배치
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 20, // 상단 여백 추가
    gap: 12,
  },
  quickStartButton: {
    flex: 1,
    backgroundColor: '#8B7CF6',
    borderRadius: 20,
    padding: 20,
    minHeight: 120,
  },
  studyButton: {
    flex: 1,
    backgroundColor: '#EC4899',
    borderRadius: 20,
    padding: 20,
    minHeight: 120,
  },
  buttonContent: {
    flex: 1,
    justifyContent: 'space-between', // 상단과 하단으로 분리
  },
  buttonTextTop: {
    alignItems: 'flex-start',
  },
  buttonBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: -10, // 하단 여백 추가로 더 아래로 배치
  },
  buttonSubtitle: {
    color: '#FFFFFF',
    fontSize: 16,
    opacity: 1,
    lineHeight: 20,
    marginBottom: 2,
  },
  buttonTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 22, // lineHeight 추가
  },
  buttonArrow: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 30, // 텍스트와 같은 lineHeight로 정렬
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
