import React, { useState,} from "react";
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from "react-native";

// カードの状態を表す型定義
type Card = {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
};

export default function Index() {
  // カードの配列を管理する状態
  const [cards, setCards] = useState<Card[]>([]);
  // めくられたカードを追跡する状態
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  // ゲームの状態（プレイ中かどうか）
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  // 試行回数
  const [attempts, setAttempts] = useState<number>(0);

  // カードの初期化関数
  const initializeGame = () => {
    // 絵文字の数を少なくして、より小さなゲームにする
    const emojis = ["🐶", "🐱", "🐭", "🐰", "🦊",];
    let newCards: Card[] = [];

    // 各絵文字のペアを作成
    emojis.forEach((emoji, index) => {
      // 同じ絵文字のカードを2枚作成
      newCards.push({
        id: index * 2,
        value: emoji,
        isFlipped: false,
        isMatched: false,
      });
      newCards.push({
        id: index * 2 + 1,
        value: emoji,
        isFlipped: false,
        isMatched: false,
      });
    });

    // カードをシャッフル
    for (let i = newCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
    }

    setCards(newCards);
    setFlippedCards([]);
    setAttempts(0);
    setIsPlaying(true);
  };

  // カードがタップされた時の処理
  const handleCardPress = (card: Card) => {
    // すでにめくられているか、マッチしているカードは無視
    if (card.isFlipped || card.isMatched || flippedCards.length >= 2) {
      return;
    }

    // カードをめくる
    const updatedCards = cards.map((c) =>
      c.id === card.id ? { ...c, isFlipped: true } : c
    );
    setCards(updatedCards);

    const updatedFlippedCards = [...flippedCards, card];
    setFlippedCards(updatedFlippedCards);

    // 2枚めくった時の処理
    if (updatedFlippedCards.length === 2) {
      setAttempts(attempts + 1);
      
      // 2枚のカードが一致するかチェック
      if (updatedFlippedCards[0].value === updatedFlippedCards[1].value) {
        // 一致した場合
        setTimeout(() => {
          setCards(
            cards.map((c) =>
              c.id === updatedFlippedCards[0].id || c.id === updatedFlippedCards[1].id
                ? { ...c, isMatched: true }
                : c
            )
          );
          setFlippedCards([]);
        }, 500);
      } else {
        // 一致しない場合、カードを裏返す
        setTimeout(() => {
          setCards(
            cards.map((c) =>
              c.id === updatedFlippedCards[0].id || c.id === updatedFlippedCards[1].id
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // すべてのカードがマッチしたかチェック
  const isGameComplete = cards.length > 0 && cards.every((card) => card.isMatched);

  // 画面幅に応じたカードサイズの計算
  const windowWidth = Dimensions.get("window").width;
  // 3列でカード表示に変更（より小さく表示）
  const cardSize = (windowWidth - 100) / 5; 

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>神経衰弱ゲーム</Text>
        
        {!isPlaying ? (
          <TouchableOpacity style={styles.startButton} onPress={initializeGame}>
            <Text style={styles.buttonText}>ゲームを始める</Text>
          </TouchableOpacity>
        ) : (
          <>
            <Text style={styles.stats}>試行回数: {attempts}</Text>
            
            <View style={styles.cardContainer}>
              {cards.map((card) => (
                <TouchableOpacity
                  key={card.id}
                  style={[
                    styles.card,
                    { width: cardSize, height: cardSize },
                    card.isFlipped && styles.cardFlipped,
                    card.isMatched && styles.cardMatched,
                  ]}
                  onPress={() => handleCardPress(card)}
                  disabled={card.isFlipped || card.isMatched}
                >
                  {card.isFlipped || card.isMatched ? (
                    <Text style={styles.cardText}>{card.value}</Text>
                  ) : (
                    <Text style={styles.cardBack}>?</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
            
            {isGameComplete && (
              <View style={styles.completeContainer}>
                <Text style={styles.completeText}>
                  ゲームクリア！ 試行回数: {attempts}
                </Text>
                <TouchableOpacity style={styles.startButton} onPress={initializeGame}>
                  <Text style={styles.buttonText}>もう一度プレイ</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {isPlaying && !isGameComplete && (
              <TouchableOpacity 
                style={[styles.startButton, styles.resetButton]} 
                onPress={initializeGame}
              >
                <Text style={styles.buttonText}>リセット</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginVertical: 20,
  },
  card: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2196F3",
    borderRadius: 8,
    margin: 1,
  },
  cardFlipped: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CCCCCC",
  },
  cardMatched: {
    backgroundColor: "#4CAF50",
    borderWidth: 1,
    borderColor: "#388E3C",
  },
  cardText: {
    fontSize: 28, // フォントサイズを少し小さく
  },
  cardBack: {
    fontSize: 20, // フォントサイズを少し小さく
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  stats: {
    fontSize: 18,
    marginVertical: 10,
  },
  startButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  resetButton: {
    backgroundColor: "#FF9800",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  completeContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  completeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 10,
  },
});
