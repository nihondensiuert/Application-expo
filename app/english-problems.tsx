import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface Problem {
  id: string;
  level: string;
  levelColor: string;
  title: string;
  questionCount: string;
  image: string; // 이모지 string으로 변경
}

export default function EnglishProblemsScreen() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  const problems: Problem[] = [
    {
      id: '1',
      level: 'おすうめ',
      levelColor: '#FFB6C1',
      title: '英語基礎単語',
      questionCount: '30問題',
      image: '📖' // 임시 이모지
    },
    {
      id: '2',
      level: 'おすうめ',
      levelColor: '#FFB6C1',
      title: '英語基礎単語',
      questionCount: '30問題',
      image: '📖' // 임시 이모지
    },
    {
      id: '3',
      level: '中級',
      levelColor: '#9C88FF',
      title: '英語基礎単語',
      questionCount: '30問題',
      image: '📖' // 임시 이모지
    },
    {
      id: '4',
      level: '中級',
      levelColor: '#9C88FF',
      title: '英語基礎単語',
      questionCount: '30問題',
      image: '📖' // 임시 이모지
    }
  ];

  const handleBack = () => {
    router.back();
  };

  const handleProblemPress = (problem: Problem) => {
    setSelectedProblem(problem);
    setModalVisible(true);
  };

  const handleStartStudy = () => {
    setModalVisible(false);
    // 실제 학습 화면으로 이동
    console.log('Starting study for:', selectedProblem?.title);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedProblem(null);
  };

  const renderProblemItem = (problem: Problem) => (
    <TouchableOpacity 
      key={problem.id} 
      style={styles.problemItem}
      onPress={() => handleProblemPress(problem)}
    >
      <Text style={styles.problemImageEmoji}>{problem.image}</Text>
      
      <View style={styles.problemContent}>
        <View style={styles.problemHeader}>
          <View style={[styles.levelBadge, { backgroundColor: problem.levelColor }]}>
            <Text style={styles.levelText}>{problem.level}</Text>
          </View>
        </View>
        
        <Text style={styles.problemTitle}>{problem.title}</Text>
        <Text style={styles.questionCount}>{problem.questionCount}</Text>
      </View>
      
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.challengeButton}>
          <Text style={styles.challengeText}>挑戦する</Text>
          <Text style={styles.arrowIcon}>›</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={styles.backgroundFill} />
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>問題ルーム</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Problem List */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.problemList}>
            {problems.map(renderProblemItem)}
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/')}>
            <Image
              source={require('../assets/images/home-icon-gray.png')}
              style={styles.navIcon}
            />
            <Text style={styles.navTextInactive}>ホーム</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Image
              source={require('../assets/images/graduation-icon.png')}
              style={styles.navIcon}
            />
            <Text style={styles.navTextActive}>クラスルーム</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Image
              source={require('../assets/images/user-icon-gray.png')}
              style={styles.navIcon}
            />
            <Text style={styles.navTextInactive}>マイページ</Text>
          </TouchableOpacity>
        </View>

        {/* Problem Detail Modal */}
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
          onRequestClose={handleCloseModal}
        >
          <TouchableWithoutFeedback onPress={handleCloseModal}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={styles.modalContent}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>英単語マスター</Text>
                <Text style={styles.modalSubtitle}>[TOEIC必須単語]</Text>
                <Text style={styles.questionCount}>200問題</Text>
              </View>

              {/* Problem Image */}
              <View style={styles.modalImageContainer}>
                <View style={styles.modalImagePlaceholder}>
                  <Text style={styles.imagePlaceholderText}>📚</Text>
                  <Text style={styles.imagePlaceholderText}>학습 이미지</Text>
                </View>
              </View>

              {/* Problem Info */}
              <View style={styles.problemInfo}>
                <View style={styles.infoRow}>
                  <View style={styles.infoBadge}>
                    <Text style={styles.infoBadgeText}>予想難易度</Text>
                  </View>
                  <View style={styles.infoBadge}>
                    <Text style={styles.infoBadgeText}>問題(個数)</Text>
                  </View>
                  <View style={styles.infoBadge}>
                    <Text style={styles.infoBadgeText}>予想所要時間</Text>
                  </View>
                </View>
                
                <View style={styles.infoValueRow}>
                  <Text style={styles.infoValue}>下</Text>
                  <Text style={styles.infoValue}>10個</Text>
                  <Text style={styles.infoValue}>10分</Text>
                </View>
              </View>

              {/* Start Button */}
                  <TouchableOpacity style={styles.startButton} onPress={handleStartStudy}>
                    <Text style={styles.startButtonText}>学習を始める</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
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
    backgroundColor: '#FFFFFF',
    zIndex: -1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 26, // OnboardingHeader와 동일한 크기
    color: '#333',
    fontWeight: 'normal', // bold 제거
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 44,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  problemList: {
    paddingTop: 20,
  },
  problemItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  problemImageEmoji: {
    fontSize: 40,
    width: 60,
    height: 60,
    textAlign: 'center',
    lineHeight: 60,
    marginRight: 16,
  },
  problemContent: {
    flex: 1,
  },
  problemHeader: {
    marginBottom: 8,
  },
  levelBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  problemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  questionCount: {
    fontSize: 14,
    color: '#666',
  },
  actionContainer: {
    alignItems: 'flex-end',
  },
  challengeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  challengeText: {
    fontSize: 14,
    color: '#7F38F5',
    fontWeight: '600',
    marginRight: 4,
  },
  arrowIcon: {
    fontSize: 18,
    color: '#7F38F5',
    fontWeight: 'bold',
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 24, // 30에서 24로 축소
    paddingBottom: 30, // 40에서 30으로 축소
    maxHeight: '60%', // 70%에서 60%로 축소
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16, // 20에서 16으로 축소
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  questionCount: {
    fontSize: 16,
    color: '#7F38F5',
    fontWeight: '600',
  },
  modalImageContainer: {
    alignItems: 'center',
    marginBottom: 20, // 30에서 20으로 축소
  },
  modalImage: {
    width: width - 80,
    height: 200,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  modalImagePlaceholder: {
    width: width - 80,
    height: 160, // 200에서 160으로 축소
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: '#666',
    marginVertical: 4,
  },
  problemInfo: {
    marginBottom: 24, // 30에서 24로 축소
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoBadge: {
    backgroundColor: '#8B7CF6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    flex: 1,
    marginHorizontal: 4,
  },
  infoBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  infoValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    flex: 1,
  },
  startButton: {
    backgroundColor: '#8B7CF6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
