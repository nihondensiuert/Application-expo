import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const { width } = Dimensions.get('window');
const ITEM_SIZE = width * 0.3;

interface Category {
  id: string;
  name: string;
  image: any;
  selected: boolean;
}

export default function CategorySelectionScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  
  const [categories, setCategories] = useState<Category[]>([
    { id: 'english', name: '英語', image: require('../../assets/images/category-english.png'), selected: false },
    { id: 'math', name: '数学', image: require('../../assets/images/category-math.png'), selected: false },
    { id: 'geography', name: '地理', image: require('../../assets/images/category-geography.png'), selected: false },
    { id: 'science', name: '理科', image: require('../../assets/images/category-science.png'), selected: false },
    { id: 'kanji', name: '漢字', image: require('../../assets/images/category-kanji.png'), selected: false },
    { id: 'history', name: '日本史', image: require('../../assets/images/category-history.png'), selected: false },
  ]);
  
  const toggleCategory = (id: string) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    
    setCategories(prevCategories => 
      prevCategories.map(category => 
        category.id === id 
          ? { ...category, selected: !category.selected } 
          : category
      )
    );
  };
  
  const handleComplete = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    const selectedCategories = categories.filter(category => category.selected);
    
    if (selectedCategories.length > 0) {
      router.push('/avatar-selection');
    }
  };
  
  const handleSkip = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    router.push('/user-profile');
  };
  
  const handleBack = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    router.back();
  };
  
  return (
    <SafeAreaView style={[
      styles.container, 
      { backgroundColor: Colors[colorScheme ?? 'light'].background }
    ]}>
      <View style={[styles.contentContainer, { marginTop: 24 }]}>
        <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
          興味があるカテゴリを選択してください。
        </Text>
        <Text style={styles.subtitle}>
          科目推薦に活用されます(重複選択可能)
        </Text>
        
        <ScrollView contentContainerStyle={styles.categoriesContainer}>
          <View style={styles.categoriesGrid}>
            {categories.map(category => {
              const scaleAnim = useRef(new Animated.Value(1)).current;
              
              const handlePress = () => {
                Animated.sequence([
                  Animated.timing(scaleAnim, {
                    toValue: 0.9,
                    duration: 100,
                    useNativeDriver: true,
                  }),
                  Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 4,
                    tension: 40,
                    useNativeDriver: true,
                  })
                ]).start();
                
                toggleCategory(category.id);
              };
              
              return (
                <TouchableOpacity
                  key={category.id}
                  style={styles.categoryItem}
                  onPress={handlePress}
                  activeOpacity={0.7}
                >
                  <Animated.View 
                    style={[
                      styles.categoryImageContainer,
                      { 
                        borderColor: category.selected ? '#7F38F5' : 'transparent',
                        transform: [{ scale: scaleAnim }]
                      }
                    ]}
                  >
                    <Image
                      source={category.image}
                      style={styles.categoryImage}
                      resizeMode="contain"
                    />
                  </Animated.View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[
            styles.completeButton,
            { 
              backgroundColor: categories.some(cat => cat.selected) ? '#0C0C0C' : '#CCCCCC'
            }
          ]} 
          onPress={handleComplete}
          disabled={!categories.some(cat => cat.selected)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.completeButtonText,
            { 
              color: categories.some(cat => cat.selected) ? '#FFFFFF' : '#666666'
            }
          ]}>次へ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
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
  categoriesContainer: {
    paddingBottom: 20,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  categoryItem: {
    width: ITEM_SIZE,
    marginBottom: 15,
    alignItems: 'center',
  },
  categoryImageContainer: {
    width: ITEM_SIZE * 0.8,
    height: ITEM_SIZE * 0.8,
    borderRadius: (ITEM_SIZE * 0.8) / 2,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  categoryImage: {
    width: '60%',
    height: '60%',
  },
  categoryName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
    // borderTopWidth: 1, // 위쪽 선 제거
    // borderTopColor: '#E5E5E5', // 위쪽 선 제거
  },
  completeButton: {
    backgroundColor: '#0C0C0C', // #BE3455에서 #0C0C0C로 변경
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold', // '600'에서 'bold'로 변경하여 통일
  },
});