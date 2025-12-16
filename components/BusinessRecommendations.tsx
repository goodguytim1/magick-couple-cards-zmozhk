
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { RecommendedBusiness } from '@/utils/recommendations';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from './IconSymbol';

interface BusinessRecommendationsProps {
  businesses: RecommendedBusiness[];
  darkMode: boolean;
  monetizationMode: 'affiliate' | 'sponsor';
}

export const BusinessRecommendations: React.FC<BusinessRecommendationsProps> = ({
  businesses,
  darkMode,
  monetizationMode,
}) => {
  if (businesses.length === 0) {
    return null;
  }

  const bgColor = darkMode ? colors.darkCard : colors.card;
  const textColor = darkMode ? colors.darkText : colors.text;
  const secondaryTextColor = darkMode ? colors.darkTextSecondary : colors.textSecondary;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconSymbol
          ios_icon_name="location.fill"
          android_material_icon_name="location-on"
          size={20}
          color={colors.secondary}
        />
        <Text style={[styles.title, { color: textColor }]}>Recommended Nearby</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {businesses.map((business, index) => (
          <View key={index} style={[styles.businessCard, { backgroundColor: bgColor }]}>
            <View style={styles.businessHeader}>
              <Text style={[styles.businessName, { color: textColor }]}>{business.name}</Text>
              {business.source === monetizationMode && (
                <View style={[styles.badge, { backgroundColor: colors.accent + '30' }]}>
                  <Text style={[styles.badgeText, { color: colors.accent }]}>
                    {business.source === 'sponsor' ? 'Sponsored' : 'Partner'}
                  </Text>
                </View>
              )}
            </View>

            <Text style={[styles.category, { color: secondaryTextColor }]}>
              {business.category}
            </Text>

            {business.description && (
              <Text style={[styles.description, { color: secondaryTextColor }]} numberOfLines={2}>
                {business.description}
              </Text>
            )}

            <View style={styles.footer}>
              <View style={styles.distanceContainer}>
                <IconSymbol
                  ios_icon_name="location"
                  android_material_icon_name="location-on"
                  size={14}
                  color={colors.secondary}
                />
                <Text style={[styles.distance, { color: colors.secondary }]}>
                  {business.distance.toFixed(1)} mi
                </Text>
              </View>

              {business.rating && (
                <View style={styles.ratingContainer}>
                  <IconSymbol
                    ios_icon_name="star.fill"
                    android_material_icon_name="star"
                    size={14}
                    color={colors.highlight}
                  />
                  <Text style={[styles.rating, { color: textColor }]}>
                    {business.rating.toFixed(1)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  businessCard: {
    width: 250,
    padding: 15,
    borderRadius: 12,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  businessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  businessName: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  category: {
    fontSize: 13,
    textTransform: 'capitalize',
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distance: {
    fontSize: 13,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 13,
    fontWeight: '600',
  },
});
