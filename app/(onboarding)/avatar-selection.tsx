import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

// ExpressionItem 컴포넌트의 props 타입 정의
interface ExpressionItemProps {
  img: any;
  idx: number;
  selected: number | null;
  setSelected: (index: number) => void;
  styles: any; // StyleSheet.create의 결과물이므로 any로 지정
}

// ColorItem 컴포넌트의 props 타입 정의
interface ColorItemProps {
  color: string;
  idx: number;
  selectedBodyColor: string;
  setSelectedBodyColor: (color: string) => void;
  styles: any; // StyleSheet.create의 결과물이므로 any로 지정
}

const { width, height } = Dimensions.get('screen'); // 'window' 대신 'screen' 사용

// Create an animated value for the progress bar (shared between screens)
const progressAnim = useRef(new Animated.Value(0)).current;

const expressions = [
  require('../assets/images/face1.png'),
  require('../assets/images/face2.png'),
  require('../assets/images/face3.png'),
  require('../assets/images/face4.png'),
  require('../assets/images/face5.png'),
  require('../assets/images/face6.png'),
];

const bodyColors = [
  '#F36C77', // 빨간색
  '#873DF2', // 보라색
  '#5AC8FA', // 하늘색
  '#FFC107', // 노란색
  '#4CAF50', // 초록색
  '#FF9800', // 주황색
  '#2196F3', // 파란색
  '#8BC34A', // 연두색
];

// React.memo를 사용하여 ExpressionItem 컴포넌트 정의
const ExpressionItem = React.memo(({ img, idx, selected, setSelected, styles }: ExpressionItemProps) => (
  <TouchableOpacity
    key={idx}
    style={[styles.expressionCircle, selected === idx && styles.selectedCircle]}
    onPress={() => setSelected(idx)}
    activeOpacity={0.8}
  >
    <Image source={img} style={styles.expressionImg} />
  </TouchableOpacity>
));

// React.memo를 사용하여 ColorItem 컴포넌트 정의
const ColorItem = React.memo(({ color, idx, selectedBodyColor, setSelectedBodyColor, styles }: ColorItemProps) => (
  <TouchableOpacity
    key={idx}
    style={[
      styles.colorCircle,
      { backgroundColor: color },
      selectedBodyColor === color && styles.selectedColorCircle,
    ]}
    onPress={() => setSelectedBodyColor(color)}
    activeOpacity={0.8}
  />
));

export default function AvatarSelectionScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [selected, setSelected] = useState<number | null>(0); // face1 (index 0)을 기본 선택
  const [selectedTab, setSelectedTab] = useState<'expression' | 'color'>('expression');
  const [selectedBodyColor, setSelectedBodyColor] = useState<string>(bodyColors[0]);
  const [modalVisible, setModalVisible] = useState(false); // 처음엔 숨김

  const handleNext = () => {
    console.log('Next button pressed, showing modal');
    setModalVisible(true);
  };

  const handleStart = () => {
    console.log('Start button pressed, hiding modal');
    setModalVisible(false);
    router.replace('/home'); // 홈 화면으로 이동
  };

  return (
    <>
      <SafeAreaView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>  
        {/* OnboardingHeader는 _layout.tsx에서 처리됨 */}
        
        <View style={styles.contentContainer}>
          <Text style={[styles.question, { color: Colors[colorScheme ?? 'light'].text, marginTop: 24 }]}>どんな姿をしていますか？</Text>
          {/* 캐릭터 */}
          <View style={styles.avatarContainer}>
            {/* <Image source={require('../assets/images/background.png')} style={styles.avatarImage} /> */}
            {/* SVG 몸통 다시 사용 */}
            <Svg width={width * 0.6 * 0.8} height={width * 0.6 * 0.8 * (81/146)} viewBox="0 0 146 81" style={styles.svgBodyContainer}>
              <G>
                <Path d="M9.989 74.439C13.1513 78.6298 18.1655 81.0235 23.4151 81L125.433 80.6154C125.433 80.6154 145.247 79.8227 134.944 59.6139C134.944 59.6139 153.564 57.236 142.469 34.249C142.469 34.249 137.321 18.7961 117.9 28.7004C117.9 28.7004 121.07 16.8105 111.167 15.2252C101.264 13.6399 98.0943 19.9812 98.0943 19.9812C98.0943 19.9812 96.9095 6.90626 86.2062 6.90626C75.503 6.90626 71.5482 11.6622 71.5482 11.6622C71.5482 11.6622 69.9631 -2.99801 49.7572 0.565018C29.5514 4.12805 33.9064 18.0034 33.9064 18.0034C33.9064 18.0034 11.7153 12.0625 2.60504 30.2857C-6.50525 48.5168 11.323 57.6284 11.323 57.6284C11.323 57.6284 5.20237 65.5314 9.34555 73.4815C9.34555 73.4815 9.56527 73.8504 10.0047 74.439H9.989Z" fill={selectedBodyColor} />
              </G>
            </Svg>
            {selected !== null && (
              <Image source={expressions[selected]} style={styles.faceOverlay} />
            )}
          </View>
          {/* 표정/색상 선택 탭 */}
          <View style={styles.tabRow}>
            <TouchableOpacity onPress={() => setSelectedTab('expression')} style={{ marginRight: 20 }}>
              <Text style={[styles.tabText, selectedTab === 'expression' && styles.tabActiveText]}>表情</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedTab('color')}>
              <Text style={[styles.tabText, selectedTab === 'color' && styles.tabActiveText]}>色</Text>
            </TouchableOpacity>
          </View>
          {/* 콘텐츠 - 탭에 따라 변경 */}
          {selectedTab === 'expression' ? (
            <View style={styles.expressionGrid}>
              {expressions.map((img, idx) => (
                <ExpressionItem
                  key={idx}
                  img={img}
                  idx={idx}
                  selected={selected}
                  setSelected={setSelected}
                  styles={styles}
                />
              ))}
            </View>
          ) : (
            <View style={styles.colorGrid}>
              {bodyColors.map((color, idx) => (
                <ColorItem
                  key={idx}
                  color={color}
                  idx={idx}
                  selectedBodyColor={selectedBodyColor}
                  setSelectedBodyColor={setSelectedBodyColor}
                  styles={styles}
                />
              ))}
            </View>
          )}
        </View>
        
        {/* 다음 버튼 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              { backgroundColor: '#0C0C0C' } // face1이 기본 선택되므로 항상 활성화
            ]}
            onPress={handleNext}
          >
            <Text style={{ 
              color: '#FFFFFF', // 항상 흰색 텍스트
              fontSize: 16, 
              fontWeight: 'bold' 
            }}>次へ</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      
      {/* Welcome 모달 - 전체 화면 덮기 */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
        statusBarTranslucent={true} // 상태바까지 덮도록
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* 체크마크 아이콘 */}
            <Image 
              source={require('../../assets/images/checkmark.png')} 
              style={styles.checkmarkImage}
            />
            
            <Text style={styles.welcomeTitle}>Welcome</Text>
            <Text style={styles.welcomeSubtitle}>オボエGOへようこそ。</Text>
            <Text style={styles.welcomeDescription}>カードをめくって楽しく学習しましょう！</Text>
            
            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
              <Text style={styles.startButtonText}>スタート</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20 },
  contentContainer: { flex: 1 }, // 추가된 contentContainer
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  backButton: { padding: 8 },
  backButtonText: { fontSize: 24, color: '#888' },
  skipText: { color: '#bbb', fontSize: 16 },
  progressBarBg: { height: 6, backgroundColor: '#eee', marginHorizontal: 0, marginTop: 10 },
  progressBar: { height: 6, width: '70%', backgroundColor: '#A084F7', borderRadius: 3 },
  question: { fontSize: 18, fontWeight: '500', marginTop: 24, marginBottom: 12, textAlign: 'center' },
  avatarContainer: {
    width: width * 0.6,
    height: width * 0.6,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    position: 'relative',
    marginVertical: 10,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    resizeMode: 'contain',
  },
  svgBodyContainer: {
    position: 'absolute',
    width: width * 0.8 * 1.2,
    height: width * 0.8 * 1.2 * (81/146),
    left: (width * 0.6 - width * 0.6 * 0.8) / 2,
    top: (width * 0.6 - width * 0.6 * 0.8 * (81/146)) / 2 + 20,
    zIndex: 1,
  },
  tabRow: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginLeft: 30, marginTop: 10 },
  tabText: {
    fontSize: 16,
    paddingBottom: 5,
    color: '#B6B6B6',
  },
  tabActiveText: {
    fontWeight: 'bold',
    color: '#000',
    borderBottomWidth: 2,
    borderColor: '#A084F7',
  },
  expressionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 16 },
  expressionCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#D6E6FF',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    borderWidth: 0,
  },
  selectedCircle: { borderWidth: 3, borderColor: '#A084F7' },
  expressionImg: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  buttonContainer: { 
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
  },
  nextButton: { 
    paddingVertical: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  faceOverlay: {
    width: width * 0.4 * 0.4,
    height: width * 0.3 * 0.5,
    position: 'absolute',
    left: 90,
    top: 115,
    resizeMode: 'contain',
    pointerEvents: 'none',
    zIndex: 3,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 30, // 좌우 여백 증가
    width: '100%',
  },
  colorCircle: {
    width: 75, // 65에서 75로 크기 증가
    height: 75, // 65에서 75로 크기 증가
    borderRadius: 37.5, // 32.5에서 37.5로 증가
    marginBottom: 15, // 하단 여백 조정
    borderWidth: 3, // 테두리 두께 증가
    borderColor: 'transparent',
    flexBasis: '22%', // 4개씩 배치 (100% / 4 = 25%, 여백 고려해서 22%)
  },
  selectedColorCircle: {
    borderColor: '#7F38F5', // 선택된 색상을 보라색으로 통일
    borderWidth: 3, // 테두리 두께 유지
  },
  // 모달 스타일들
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 40,
    paddingVertical: 50,
    alignItems: 'center',
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  checkmarkImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#0C0C0C',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 