
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { colors } from '@/styles/commonStyles';
import { decks } from '@/data/content';
import { Card, Deck } from '@/types';
import { DeckSelector } from '@/components/DeckSelector';
import { CardView } from '@/components/CardView';
import { BusinessRecommendations } from '@/components/BusinessRecommendations';
import { IconSymbol } from '@/components/IconSymbol';
import { useFavorites } from '@/hooks/useFavorites';
import { useSettings } from '@/hooks/useSettings';
import { useDailyCard } from '@/hooks/useDailyCard';
import { RecommendationEngine, RecommendedBusiness } from '@/utils/recommendations';

type Mode = 'home' | 'draw' | 'favorites' | 'daily' | 'categories';

export default function HomeScreen() {
  const [mode, setMode] = useState<Mode>('home');
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendedBusiness[]>([]);
  const [loading, setLoading] = useState(false);

  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { settings, updateSettings } = useSettings();
  const allCards = decks.flatMap(d => d.cards);
  const { dailyCard } = useDailyCard(allCards);

  const bgColor = settings.darkMode ? colors.darkBackground : colors.background;
  const textColor = settings.darkMode ? colors.darkText : colors.text;
  const secondaryTextColor = settings.darkMode ? colors.darkTextSecondary : colors.textSecondary;

  useEffect(() => {
    if (currentCard && !currentCard.isAtHome) {
      loadRecommendations();
    }
  }, [currentCard, settings.monetizationMode]);

  const loadRecommendations = async () => {
    if (!currentCard) return;
    
    setLoading(true);
    try {
      const recs = await RecommendationEngine.getRecommendations(
        currentCard,
        null,
        settings.monetizationMode
      );
      setRecommendations(recs);
    } catch (error) {
      console.log('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrawCard = () => {
    if (!selectedDeck) {
      Alert.alert('Select a Deck', 'Please choose a deck first');
      return;
    }

    const cards = selectedDeck.cards;
    const randomIndex = Math.floor(Math.random() * cards.length);
    setCurrentCard(cards[randomIndex]);
    setMode('draw');
  };

  const handleShuffle = () => {
    if (!selectedDeck) return;
    handleDrawCard();
  };

  const handleShowDaily = () => {
    if (dailyCard) {
      setCurrentCard(dailyCard);
      setMode('daily');
    }
  };

  const handleShowFavorites = () => {
    setMode('favorites');
  };

  const getFavoriteCards = (): Card[] => {
    return allCards.filter(card => isFavorite(card.id));
  };

  const renderHome = () => (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Image 
            source={require('@/assets/images/2f32a6ce-d9ea-44d4-a489-d710fb0b74aa.png')}
            style={styles.crystalBall}
            resizeMode="contain"
          />
          <Text style={[styles.appTitle, { color: textColor }]}>Magick</Text>
        </View>
        <Text style={[styles.subtitle, { color: secondaryTextColor }]}>
          Where conversations become Magick
        </Text>
      </View>

      <DeckSelector
        decks={decks}
        selectedDeck={selectedDeck}
        onSelectDeck={setSelectedDeck}
        darkMode={settings.darkMode}
      />

      <View style={styles.actionButtons}>
        <Text style={[styles.actionSubtitle, { color: secondaryTextColor }]}>
          Connect with people through cards
        </Text>

        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          onPress={handleDrawCard}
        >
          <IconSymbol
            ios_icon_name="sparkles"
            android_material_icon_name="auto-awesome"
            size={24}
            color="#FFFFFF"
          />
          <Text style={styles.primaryButtonText}>Draw Card</Text>
        </TouchableOpacity>

        <View style={styles.secondaryButtons}>
          <TouchableOpacity
            style={[styles.secondaryButton, { backgroundColor: settings.darkMode ? colors.darkCard : colors.card }]}
            onPress={handleShuffle}
          >
            <IconSymbol
              ios_icon_name="shuffle"
              android_material_icon_name="shuffle"
              size={20}
              color={colors.primary}
            />
            <Text style={[styles.secondaryButtonText, { color: textColor }]}>Shuffle</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { backgroundColor: settings.darkMode ? colors.darkCard : colors.card }]}
            onPress={handleShowDaily}
          >
            <IconSymbol
              ios_icon_name="calendar"
              android_material_icon_name="today"
              size={20}
              color={colors.secondary}
            />
            <Text style={[styles.secondaryButtonText, { color: textColor }]}>Daily</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { backgroundColor: settings.darkMode ? colors.darkCard : colors.card }]}
            onPress={handleShowFavorites}
          >
            <IconSymbol
              ios_icon_name="heart.fill"
              android_material_icon_name="favorite"
              size={20}
              color={colors.highlight}
            />
            <Text style={[styles.secondaryButtonText, { color: textColor }]}>Favorites</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.toggles}>
        <TouchableOpacity
          style={styles.toggle}
          onPress={() => updateSettings({ darkMode: !settings.darkMode })}
        >
          <IconSymbol
            ios_icon_name={settings.darkMode ? 'moon.fill' : 'sun.max.fill'}
            android_material_icon_name={settings.darkMode ? 'dark-mode' : 'light-mode'}
            size={20}
            color={textColor}
          />
          <Text style={[styles.toggleText, { color: textColor }]}>
            {settings.darkMode ? 'Dark' : 'Light'} Mode
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toggle}
          onPress={() =>
            updateSettings({
              monetizationMode: settings.monetizationMode === 'affiliate' ? 'sponsor' : 'affiliate',
            })
          }
        >
          <IconSymbol
            ios_icon_name="dollarsign.circle"
            android_material_icon_name="monetization-on"
            size={20}
            color={textColor}
          />
          <Text style={[styles.toggleText, { color: textColor }]}>
            {settings.monetizationMode === 'affiliate' ? 'Affiliate' : 'Sponsor'} Mode
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderDraw = () => (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.drawHeader}>
        <TouchableOpacity onPress={() => setMode('home')} style={styles.backButton}>
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="arrow-back"
            size={24}
            color={textColor}
          />
        </TouchableOpacity>
        <Text style={[styles.drawTitle, { color: textColor }]}>Your Card</Text>
        <View style={{ width: 40 }} />
      </View>

      {currentCard && (
        <>
          <View style={styles.cardContainer}>
            <CardView
              card={currentCard}
              isFavorite={isFavorite(currentCard.id)}
              onToggleFavorite={() => toggleFavorite(currentCard.id)}
              darkMode={settings.darkMode}
            />
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
          ) : (
            <BusinessRecommendations
              businesses={recommendations}
              darkMode={settings.darkMode}
              monetizationMode={settings.monetizationMode}
            />
          )}

          <TouchableOpacity
            style={[styles.drawAgainButton, { backgroundColor: colors.primary }]}
            onPress={handleDrawCard}
          >
            <Text style={styles.drawAgainText}>Draw Another Card</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );

  const renderFavorites = () => {
    const favoriteCards = getFavoriteCards();

    return (
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.drawHeader}>
          <TouchableOpacity onPress={() => setMode('home')} style={styles.backButton}>
            <IconSymbol
              ios_icon_name="chevron.left"
              android_material_icon_name="arrow-back"
              size={24}
              color={textColor}
            />
          </TouchableOpacity>
          <Text style={[styles.drawTitle, { color: textColor }]}>Favorites</Text>
          <View style={{ width: 40 }} />
        </View>

        {favoriteCards.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol
              ios_icon_name="heart"
              android_material_icon_name="favorite-border"
              size={60}
              color={secondaryTextColor}
            />
            <Text style={[styles.emptyText, { color: secondaryTextColor }]}>
              No favorites yet
            </Text>
            <Text style={[styles.emptySubtext, { color: secondaryTextColor }]}>
              Tap the heart icon on cards to save them here
            </Text>
          </View>
        ) : (
          favoriteCards.map((card, index) => (
            <View key={index} style={styles.favoriteCard}>
              <CardView
                card={card}
                isFavorite={true}
                onToggleFavorite={() => toggleFavorite(card.id)}
                darkMode={settings.darkMode}
              />
            </View>
          ))
        )}
      </ScrollView>
    );
  };

  const renderDaily = () => (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.drawHeader}>
        <TouchableOpacity onPress={() => setMode('home')} style={styles.backButton}>
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="arrow-back"
            size={24}
            color={textColor}
          />
        </TouchableOpacity>
        <Text style={[styles.drawTitle, { color: textColor }]}>Daily Card</Text>
        <View style={{ width: 40 }} />
      </View>

      <Text style={[styles.dailySubtitle, { color: secondaryTextColor }]}>
        Same for everyone today ✨
      </Text>

      {currentCard && (
        <View style={styles.cardContainer}>
          <CardView
            card={currentCard}
            isFavorite={isFavorite(currentCard.id)}
            onToggleFavorite={() => toggleFavorite(currentCard.id)}
            darkMode={settings.darkMode}
          />
        </View>
      )}
    </ScrollView>
  );

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {mode === 'home' && renderHome()}
      {mode === 'draw' && renderDraw()}
      {mode === 'favorites' && renderFavorites()}
      {mode === 'daily' && renderDaily()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 48,
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  crystalBall: {
    width: 48,
    height: 48,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  actionButtons: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  actionSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 22,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 18,
    borderRadius: 15,
    marginBottom: 15,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  toggles: {
    paddingHorizontal: 20,
    marginTop: 30,
    gap: 12,
  },
  toggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '500',
  },
  drawHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  drawTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  cardContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  drawAgainButton: {
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  drawAgainText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  favoriteCard: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dailySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
});
