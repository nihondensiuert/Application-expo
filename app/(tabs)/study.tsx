import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Problem {
  id: string;
  title: string;
  subject: string;
  date: string;
  duration: string;
  isBookmarked: boolean;
  status: 'all' | 'solved' | 'unsolved';
  image: any;
}

const StudyScreen = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'my' | 'shared'>('my');
  const [activeFilter, setActiveFilter] = useState<'all' | 'solved' | 'unsolved' | 'bookmarked'>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  // サンプルデータ
  const problems: Problem[] = [
    {
      id: '1',
      title: 'センター試験によく出る数学の基本問題',
      subject: '数学',
      date: '2025/06/04',
      duration: '5min',
      isBookmarked: false,
      status: 'all',
      image: require('../../assets/images/problem-math.png'),
    },
    {
      id: '2',
      title: 'センター試験によく出る数学の基本問題',
      subject: '数学',
      date: '2025/06/04',
      duration: '5min',
      isBookmarked: false,
      status: 'all',
      image: require('../../assets/images/problem-math.png'),
    },
  ];

  const [problemList, setProblemList] = useState(problems);

  const toggleBookmark = (id: string) => {
    setProblemList(prev =>
      prev.map(problem =>
        problem.id === id
          ? { ...problem, isBookmarked: !problem.isBookmarked }
          : problem
      )
    );
  };

  const filteredProblems = problemList.filter(problem => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'bookmarked') return problem.isBookmarked;
    return problem.status === activeFilter;
  });

  const renderProblemCard = (problem: Problem) => (
    <TouchableOpacity 
      key={problem.id} 
      style={styles.problemCard}
      onPress={() => {
        setSelectedProblem(problem);
        setModalVisible(true);
      }}
    >
      <View style={styles.cardImageContainer}>
        <Image source={problem.image} style={styles.cardImage} />
        <TouchableOpacity style={styles.translateButton}>
          <Image 
            source={require('../../assets/images/moncheck.png')} 
            style={styles.translateIcon}
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{problem.title}</Text>
          <TouchableOpacity onPress={() => toggleBookmark(problem.id)}>
            <Ionicons
              name={problem.isBookmarked ? "bookmark" : "bookmark-outline"}
              size={24}
              color={problem.isBookmarked ? "#FFD700" : "#666"}
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.cardMeta}>
          <Text style={styles.subject}>{problem.subject}</Text>
          <View style={styles.metaInfo}>
            <Ionicons name="calendar-outline" size={14} color="#666" />
            <Text style={styles.metaText}>{problem.date}</Text>
            <Ionicons name="time-outline" size={14} color="#666" style={{ marginLeft: 12 }} />
            <Text style={styles.metaText}>{problem.duration}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>自習勉強</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Header Tabs */}
      <View style={styles.headerTabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'my' && styles.activeTab]}
          onPress={() => setActiveTab('my')}
        >
          <Text style={[styles.tabText, activeTab === 'my' && styles.activeTabText]}>
            私の問題
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'shared' && styles.activeTab]}
          onPress={() => setActiveTab('shared')}
        >
          <Text style={[styles.tabText, activeTab === 'shared' && styles.activeTabText]}>
            共有問題
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 'all' && styles.activeFilterButton]}
            onPress={() => setActiveFilter('all')}
          >
            <Text style={[styles.filterText, activeFilter === 'all' && styles.activeFilterText]}>
              すべて
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 'solved' && styles.activeFilterButton]}
            onPress={() => setActiveFilter('solved')}
          >
            <Text style={[styles.filterText, activeFilter === 'solved' && styles.activeFilterText]}>
              解く
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 'unsolved' && styles.activeFilterButton]}
            onPress={() => setActiveFilter('unsolved')}
          >
            <Text style={[styles.filterText, activeFilter === 'unsolved' && styles.activeFilterText]}>
              解からない
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 'bookmarked' && styles.activeFilterButton]}
            onPress={() => setActiveFilter('bookmarked')}
          >
            <Ionicons 
              name={activeFilter === 'bookmarked' ? "bookmark" : "bookmark-outline"} 
              size={16} 
              color={activeFilter === 'bookmarked' ? "white" : "#666"} 
            />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.sortButton}>
          <Ionicons name="swap-vertical" size={16} color="#666" />
          <Text style={styles.sortText}>最新順</Text>
        </TouchableOpacity>
      </View>

      {/* Problem List */}
      <ScrollView style={styles.problemList} showsVerticalScrollIndicator={false}>
        {filteredProblems.map(renderProblemCard)}
      </ScrollView>

      {/* Bottom Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalBackground}
            onPress={() => setModalVisible(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>
              {selectedProblem?.title}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton}>
                <Ionicons name="play-circle" size={24} color="#6366F1" />
                <Text style={styles.modalButtonText}>問題を解く</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton}>
                <Ionicons name="pencil" size={24} color="#6366F1" />
                <Text style={styles.modalButtonText}>編集</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton}>
                <Ionicons name="share" size={24} color="#6366F1" />
                <Text style={styles.modalButtonText}>共有</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton}>
                <Ionicons name="trash" size={24} color="#EF4444" />
                <Text style={[styles.modalButtonText, { color: '#EF4444' }]}>削除</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/home')}
        >
          <Image
            source={require('../../assets/images/home-icon.png')}
            style={styles.navIcon}
          />
          <Text style={styles.navTextActive}>ホーム</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/(tabs)/classroom')}
        >
          <Image
            source={require('../../assets/images/graduation-icon-gray.png')}
            style={styles.navIcon}
          />
          <Text style={styles.navTextInactive}>クラスルーム</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/(tabs)/mypage')}
        >
          <Image
            source={require('../../assets/images/user-icon-gray.png')}
            style={styles.navIcon}
          />
          <Text style={styles.navTextInactive}>マイページ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerSpacer: {
    width: 32, // backButton과 같은 너비로 중앙 정렬
  },
  headerTabs: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 25,
    padding: 4,
    height: 50,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 1,
    backgroundColor: 'transparent',
  },
  activeTab: {
    backgroundColor: '#6366F1',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: 'white',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  filterButtons: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: '#333',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeFilterText: {
    color: 'white',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  problemList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  problemCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImageContainer: {
    position: 'relative',
    height: 200,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  translateButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    padding: 8,
  },
  translateIcon: {
    width: 16,
    height: 16,
    tintColor: '#FFFFFF',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subject: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackground: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
    minHeight: 300,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  modalButtons: {
    gap: 20,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  modalButtonText: {
    fontSize: 16,
    color: '#6366F1',
    marginLeft: 15,
    fontWeight: '500',
  },
});

export default StudyScreen;