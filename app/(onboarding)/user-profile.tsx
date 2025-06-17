import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image, // Imageを追加
  Modal,
  PanResponder,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Google from 'expo-auth-session';
// OnboardingHeaderは これから app/(onboarding)/_layout.tsxによって管理されるので削除します。
// import OnboardingHeader from '../components/OnboardingHeader';

const { width } = Dimensions.get('window');

interface GenderOption {
  id: string;
  name: string;
  selected: boolean;
}

export default function UserProfileScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  
  // --- ▼ Welcomeモーダルの状態を追加 ▼ ---
  const [isWelcomeModalVisible, setWelcomeModalVisible] = useState(false);
  
  const [genderOptions, setGenderOptions] = useState<GenderOption[]>([
    { id: 'male', name: '男性', selected: false },
    { id: 'female', name: '女性', selected: false },
    { id: 'other', name: 'その他', selected: false },
  ]);
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());
  
  const [selectedYear, setSelectedYear] = useState<string>(String(currentYear - 18));
  const [modalVisible, setModalVisible] = useState(false);
  const [tempSelectedYear, setTempSelectedYear] = useState<string>(selectedYear);
  const yearScrollViewRef = useRef<ScrollView>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          const newValue = Math.min(gestureState.dy / 300, 1);
          slideAnim.setValue(newValue);
          fadeAnim.setValue(1 - newValue * 0.5);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
          handleCancel();
        } else {
          if (Platform.OS !== 'web' && gestureState.dy > 40) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          Animated.parallel([
            Animated.spring(slideAnim, {
              toValue: 0,
              friction: 8,
              tension: 40,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;

  const handleOpenModal = () => {
    setTempSelectedYear(selectedYear);
    setModalVisible(true);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    fadeAnim.setValue(0);
    slideAnim.setValue(1);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 9,
        tension: 45,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handleConfirm = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
        easing: Easing.in(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      })
    ]).start(() => {
      setSelectedYear(tempSelectedYear);
      setModalVisible(false);
    });
  };

  const handleCancel = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
        easing: Easing.in(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      })
    ]).start(() => {
      setModalVisible(false);
    });
  };

  useEffect(() => {
    if (modalVisible) {
      setTimeout(() => {
        const selectedIndex = years.findIndex(year => year === tempSelectedYear);
        if (selectedIndex !== -1 && yearScrollViewRef.current) {
          const scrollViewHeight = 240;
          const itemHeight = 50;
          const offset = Math.max(0, selectedIndex * itemHeight - (scrollViewHeight / 2) + (itemHeight / 2));
          yearScrollViewRef.current.scrollTo({ y: offset, animated: true });
        }
      }, 300);
    }
  }, [modalVisible]);
  
  const selectGender = (id: string) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setGenderOptions(prevOptions => 
      prevOptions.map(option => ({
        ...option,
        selected: option.id === id
      }))
    );
  };
  
  // 性別が選択されているか確認する関数を追加
  const isGenderSelected = () => {
    return genderOptions.some(option => option.selected);
  };

  const [nickname, setNickname] = useState('');

  // 性別とニックネームが両方入力されている場合にのみボタンを活性化
  const isFormValid = () => {
    return nickname.trim().length > 0 && genderOptions.some(option => option.selected);
  };

  const handleComplete = () => {
    if (!isFormValid()) return;
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push({ pathname: '/category-selection' });
  };
  
  // Welcomeモーダルの「スタート」ボタンの機能を追加
  const handleStartApp = () => {
    router.replace('/');
  };

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '592113992663-dplmoe6qc8sun9c8d6etlk7bvtfjcoc4.apps.googleusercontent.com',
    iosClientId: '592113992663-sp53u84ljdmogjhpfnd111p5s2mt6gtu.apps.googleusercontent.com',
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      {/* OnboardingHeaderは これから app/(onboarding)/_layout.tsxによって管理されるので削除します。 */}
      {/* <OnboardingHeader progress={0.3} initialProgress={0} onSkip={handleSkip} /> */}
      
      <ScrollView style={[styles.contentContainer, { marginTop: 24 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.contentInnerContainer}>
          <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>追加情報を入力してください</Text>
          <Text style={styles.subtitle}>タイトルの推薦に使用されます</Text>
          <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>ニックネーム</Text>
          <TextInput
            style={styles.nicknameInput}
            placeholder="ニックネームを入力してください"
            value={nickname}
            onChangeText={setNickname}
            maxLength={20}
            placeholderTextColor="#bbb"
          />
        
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>性別</Text>
            <View style={styles.optionsContainer}>
              {genderOptions.map(option => (
                <TouchableOpacity
                  key={option.id}
                  style={[styles.optionButton, option.selected && styles.selectedOption]}
                  onPress={() => selectGender(option.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.optionText, option.selected && styles.selectedOptionText]}>
                    {option.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>生年月日</Text>
            <TouchableOpacity style={styles.yearSelector} onPress={handleOpenModal}>
              <Text style={styles.yearText}>{selectedYear}年</Text>
              <Text style={styles.dropdownIcon}>▼</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[
            styles.completeButton, 
            { 
              backgroundColor: isFormValid() ? '#0C0C0C' : '#CCCCCC'
            }
          ]} 
          onPress={handleComplete}
          disabled={!isFormValid()}
        >
          <Text style={[
            styles.completeButtonText,
            { color: isFormValid() ? '#FFFFFF' : '#666666' }
          ]}>次へ</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="none"
        onRequestClose={handleCancel}
        statusBarTranslucent={true}
      >
        <TouchableWithoutFeedback onPress={handleCancel}>
          <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
            <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
              <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 300] }) }] }]}>
                <View style={styles.dragHandleContainer}>
                  <View style={styles.dragHandleIndicator} {...panResponder.panHandlers} />
                </View>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>生年月日選択</Text>
                  <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
                    <Text style={styles.confirmButtonText}>完了</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.modalYearPickerContainer}>
                  <ScrollView ref={yearScrollViewRef} showsVerticalScrollIndicator={false}>
                    {years.map((year) => (
                      <TouchableOpacity key={year} style={[styles.modalYearOption, tempSelectedYear === year && styles.modalSelectedYearOption]} onPress={() => {
                        if (Platform.OS !== 'web' && tempSelectedYear !== year) {
                          Haptics.selectionAsync();
                        }
                        setTempSelectedYear(year);
                      }}>
                        <Text style={[styles.modalYearText, tempSelectedYear === year && styles.modalSelectedYearText]}>{year}年</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* --- ▼ Welcomeモーダルをここに追加 ▼ --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isWelcomeModalVisible}
        onRequestClose={() => setWelcomeModalVisible(false)}
      >
        <View style={styles.welcomeModalOverlay}>
          <View style={styles.welcomeModalContainer}>
            <Image
              source={require('../../assets/images/checkmark.png')} // この画像がassets/images/フォルダにあるか確認してください。
              style={styles.welcomeModalImage}
              resizeMode="contain"
            />
            <Text style={styles.welcomeModalTitle}>ようこそ</Text>
            <Text style={styles.welcomeModalSubtitle}>
              フリップGOへようこそ。{'\n'}カードをめくって楽しく学習しましょう！
            </Text>
            <TouchableOpacity
              style={styles.welcomeModalButton}
              onPress={handleStartApp}
            >
              <Text style={styles.welcomeModalButtonText}>始める</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  contentInnerContainer: { paddingBottom: 20 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  formSection: { marginBottom: 30 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    height: 50,
    justifyContent: 'center',
  },
  selectedOption: {
    backgroundColor: '#F0EBFA',
    borderWidth: 1.5,
    borderColor: '#873DF2',
  },
  optionText: { fontSize: 16, color: '#333' },
  selectedOptionText: {
    fontWeight: '600',
    color: '#873DF2',
  },
  yearSelector: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
  },
  yearText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  dropdownIcon: {
    fontSize: 22,
    color: '#873DF2',
    fontWeight: 'bold',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
  },
  completeButton: {
    backgroundColor: '#0C0C0C', // #873DF2에서 #0C0C0C로 변경
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 10,
    height: '50%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  confirmButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#873DF2',
    borderRadius: 8,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalYearPickerContainer: {
    height: '80%',
  },
  modalYearOption: {
    paddingVertical: 10,
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
  },
  modalSelectedYearOption: {
    backgroundColor: '#F0EBFA',
    borderRadius: 10,
  },
  modalYearText: {
    fontSize: 18,
    color: '#333',
  },
  modalSelectedYearText: {
    fontSize: 18,
    color: '#873DF2',
    fontWeight: 'bold',
  },
  dragHandleContainer: {
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
    paddingVertical: 5,
  },
  dragHandleIndicator: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#D1D1D1',
    marginVertical: 10,
    alignSelf: 'center',
  },
  welcomeModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeModalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  welcomeModalImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  welcomeModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  welcomeModalSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  welcomeModalButton: {
    backgroundColor: '#873DF2',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    width: '100%',
  },
  welcomeModalButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  nicknameInput: {
    height: 50,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
});