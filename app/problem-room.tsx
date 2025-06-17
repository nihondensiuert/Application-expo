import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

interface ProblemCard {
  id: string;
  category: string;
  title: string;
  image: any; // 다시 이미지로 변경
  status: 'locked' | 'available' | 'preparing';
}

export default function ProblemRoomScreen() {
  const router = useRouter();

  const problems: ProblemCard[] = [
    {
      id: '1',
      category: '英語', // 数学에서 英語로 변경
      title: '基本単語からコツコツと！',
      image: require('../assets/images/problem-en.png'),
      status: 'available' // 잠금해제
    },
    {
      id: '2',
      category: '数学',
      title: '公式暗記で実力アップ！',
      image: require('../assets/images/problem-math.png'),
      status: 'available' // 잠금해제로 변경
    },
    {
      id: '3',
      category: '科学', // 数学에서 科学으로 변경
      title: '元素記号と用語を制覇！',
      image: require('../assets/images/problem-science.png'),
      status: 'locked'
    },
    {
      id: '4',
      category: '準備中',
      title: '新しい科目準備中...',
      image: require('../assets/images/problem-history.png'),
      status: 'preparing'
    }
  ];

  const handleBack = () => {
    router.back();
  };

  const handleProblemPress = (problem: ProblemCard) => {
    if (problem.status === 'available') {
      // 사용 가능한 문제만 클릭 가능
      switch (problem.category) {
        case '英語':
          router.push('/english-problems');
          break;
        case '数学':
          // 수학 문제 화면으로 이동 (나중에 구현)
          console.log('Math problems coming soon');
          break;
        case '科学':
          // 과학 문제 화면으로 이동 (나중에 구현)
          console.log('Science problems locked');
          break;
        default:
          console.log('Problem not available');
      }
    } else {
      console.log('Problem is locked or preparing');
    }
  };

  const renderProblemCard = (problem: ProblemCard, index: number) => {
    const getLockIcon = () => {
      switch (problem.status) {
        case 'available':
          return require('../assets/images/unlock-icon.png');
        case 'locked':
          return require('../assets/images/lock-icon.png');
        case 'preparing':
          return null; // 준비중일 때는 잠금 아이콘 없음
        default:
          return require('../assets/images/lock-icon.png');
      }
    };

    const getCategoryTextStyle = () => {
      if (problem.status === 'preparing') {
        return [styles.categoryText, styles.preparingText];
      } else if (problem.category === '科学') {
        return [styles.categoryText, styles.scienceText]; // 科学만 특별한 색상
      } else {
        return styles.categoryText; // 기본 색상 (영어, 수학)
      }
    };

    const lockIcon = getLockIcon();

    return (
      <TouchableOpacity 
        key={problem.id} 
        style={styles.problemCard}
        onPress={() => handleProblemPress(problem)}
      >
        <View style={styles.cardHeader}>
          <Text style={getCategoryTextStyle()}>
            {problem.category}
          </Text>
          {lockIcon && (
            <Image 
              source={lockIcon} 
              style={styles.lockIcon}
            />
          )}
        </View>
        
        <View style={styles.cardImageContainer}>
          <Image 
            source={problem.image} 
            style={[
              styles.cardImage,
              problem.status === 'preparing' && styles.grayImage // 회색 처리
            ]}
          />
        </View>
        
        <Text style={styles.cardTitle}>{problem.title}</Text>
      </TouchableOpacity>
    );
  };

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

        {/* Problem Grid */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.problemGrid}>
            {problems.map((problem, index) => renderProblemCard(problem, index))}
          </View>
          
          {/* Coming Soon Message */}
          <View style={styles.comingSoonContainer}>
            <Text style={styles.comingSoonText}>
              もっと多くの問題を準備中ですので、お待ちください！
            </Text>
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
  problemGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  problemCard: {
    width: (width - 48) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
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
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 14,
    color: '#7F38F5', // 기본 색상 (영어, 수학)
    fontWeight: '600',
  },
  scienceText: {
    color: '#DC6D84', // 科学만 이 색상
  },
  preparingText: {
    color: '#999',
  },
  lockIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  cardImageContainer: {
    alignItems: 'center',
    marginBottom: 16,
    height: 80,
    justifyContent: 'center',
  },
  cardImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  grayImage: {
    opacity: 0.3, // 회색 처리 (투명도 적용)
  },
  cardTitle: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    lineHeight: 20,
  },
  comingSoonContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  comingSoonText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
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
