
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Deck } from '@/types';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from './IconSymbol';

interface DeckSelectorProps {
  decks: Deck[];
  selectedDeck: Deck | null;
  onSelectDeck: (deck: Deck) => void;
  darkMode: boolean;
}

export const DeckSelector: React.FC<DeckSelectorProps> = ({
  decks,
  selectedDeck,
  onSelectDeck,
  darkMode,
}) => {
  const bgColor = darkMode ? colors.darkBackground : colors.background;
  const textColor = darkMode ? colors.darkText : colors.text;
  const secondaryTextColor = darkMode ? colors.darkTextSecondary : colors.textSecondary;

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <Text style={[styles.title, { color: textColor }]}>Choose Your Deck</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {decks.map((deck, index) => {
          const isSelected = selectedDeck?.id === deck.id;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.deckCard,
                {
                  backgroundColor: darkMode ? colors.darkCard : colors.card,
                  borderColor: isSelected ? deck.color : 'transparent',
                  borderWidth: isSelected ? 3 : 0,
                },
              ]}
              onPress={() => onSelectDeck(deck)}
            >
              <View style={[styles.iconContainer, { backgroundColor: deck.color + '20' }]}>
                <IconSymbol
                  ios_icon_name={deck.icon}
                  android_material_icon_name={deck.icon as any}
                  size={40}
                  color={deck.color}
                />
              </View>
              <Text style={[styles.deckName, { color: textColor }]}>{deck.name}</Text>
              <Text style={[styles.deckDescription, { color: secondaryTextColor }]}>
                {deck.description}
              </Text>
              <Text style={[styles.cardCount, { color: deck.color }]}>
                {deck.cards.length} cards
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 15,
  },
  deckCard: {
    width: 180,
    padding: 20,
    borderRadius: 15,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  deckName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  deckDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  cardCount: {
    fontSize: 14,
    fontWeight: '600',
  },
});
