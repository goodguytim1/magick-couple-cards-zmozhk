
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Card } from '@/types';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from './IconSymbol';

interface CardViewProps {
  card: Card;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  darkMode: boolean;
}

export const CardView: React.FC<CardViewProps> = ({
  card,
  isFavorite,
  onToggleFavorite,
  darkMode,
}) => {
  const getDeckColor = () => {
    switch (card.deck) {
      case 'connection':
        return colors.primary;
      case 'datenight':
        return colors.secondary;
      case 'challenge':
        return colors.highlight;
      default:
        return colors.primary;
    }
  };

  const bgColor = darkMode ? colors.darkCard : colors.card;
  const textColor = darkMode ? colors.darkText : colors.text;
  const secondaryTextColor = darkMode ? colors.darkTextSecondary : colors.textSecondary;

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={[styles.header, { borderBottomColor: getDeckColor() }]}>
        <View style={styles.typeContainer}>
          <IconSymbol
            ios_icon_name={card.type === 'question' ? 'questionmark.circle' : 'flag.fill'}
            android_material_icon_name={card.type === 'question' ? 'help' : 'flag'}
            size={20}
            color={getDeckColor()}
          />
          <Text style={[styles.typeText, { color: getDeckColor() }]}>
            {card.type === 'question' ? 'Question' : 'Mission'}
          </Text>
        </View>
        <TouchableOpacity onPress={onToggleFavorite} style={styles.favoriteButton}>
          <IconSymbol
            ios_icon_name={isFavorite ? 'heart.fill' : 'heart'}
            android_material_icon_name={isFavorite ? 'favorite' : 'favorite-border'}
            size={24}
            color={isFavorite ? colors.highlight : secondaryTextColor}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={[styles.cardText, { color: textColor }]}>{card.text}</Text>
      </View>

      <View style={styles.footer}>
        {card.tags.slice(0, 3).map((tag, index) => (
          <View key={index} style={[styles.tag, { backgroundColor: getDeckColor() + '20' }]}>
            <Text style={[styles.tagText, { color: getDeckColor() }]}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 20,
    minHeight: 300,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: 2,
    marginBottom: 20,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeText: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  favoriteButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  cardText: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 32,
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 20,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
