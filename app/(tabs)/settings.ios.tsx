
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { colors } from '@/styles/commonStyles';
import { useSettings } from '@/hooks/useSettings';
import { IconSymbol } from '@/components/IconSymbol';

export default function SettingsScreen() {
  const { settings, updateSettings, refreshLocation } = useSettings();

  const bgColor = settings.darkMode ? colors.darkBackground : colors.background;
  const textColor = settings.darkMode ? colors.darkText : colors.text;
  const secondaryTextColor = settings.darkMode ? colors.darkTextSecondary : colors.textSecondary;
  const cardColor = settings.darkMode ? colors.darkCard : colors.card;

  const handleRefreshLocation = async () => {
    Alert.alert('Refreshing Location', 'Getting your current location...');
    await refreshLocation();
    Alert.alert('Location Updated', 'Your location has been refreshed');
  };

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: textColor }]}>Settings</Text>

        <View style={[styles.section, { backgroundColor: cardColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Appearance</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <IconSymbol
                ios_icon_name={settings.darkMode ? 'moon.fill' : 'sun.max.fill'}
                android_material_icon_name={settings.darkMode ? 'dark-mode' : 'light-mode'}
                size={24}
                color={textColor}
              />
              <View style={styles.settingText}>
                <Text style={[styles.settingLabel, { color: textColor }]}>Dark Mode</Text>
                <Text style={[styles.settingDescription, { color: secondaryTextColor }]}>
                  Use dark theme throughout the app
                </Text>
              </View>
            </View>
            <Switch
              value={settings.darkMode}
              onValueChange={(value) => updateSettings({ darkMode: value })}
              trackColor={{ false: colors.textSecondary, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: cardColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Monetization</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <IconSymbol
                ios_icon_name="dollarsign.circle"
                android_material_icon_name="monetization-on"
                size={24}
                color={textColor}
              />
              <View style={styles.settingText}>
                <Text style={[styles.settingLabel, { color: textColor }]}>
                  {settings.monetizationMode === 'affiliate' ? 'Affiliate Mode' : 'Sponsor Mode'}
                </Text>
                <Text style={[styles.settingDescription, { color: secondaryTextColor }]}>
                  {settings.monetizationMode === 'affiliate'
                    ? 'Prioritize affiliate partner recommendations'
                    : 'Prioritize sponsored business recommendations'}
                </Text>
              </View>
            </View>
            <Switch
              value={settings.monetizationMode === 'sponsor'}
              onValueChange={(value) =>
                updateSettings({ monetizationMode: value ? 'sponsor' : 'affiliate' })
              }
              trackColor={{ false: colors.textSecondary, true: colors.secondary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: cardColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Location</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <IconSymbol
                ios_icon_name="location.fill"
                android_material_icon_name="location-on"
                size={24}
                color={textColor}
              />
              <View style={styles.settingText}>
                <Text style={[styles.settingLabel, { color: textColor }]}>Current Location</Text>
                <Text style={[styles.settingDescription, { color: secondaryTextColor }]}>
                  {settings.location?.city || 'Not set'}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleRefreshLocation} style={styles.refreshButton}>
              <IconSymbol
                ios_icon_name="arrow.clockwise"
                android_material_icon_name="refresh"
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: cardColor }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>About</Text>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: secondaryTextColor }]}>Version</Text>
            <Text style={[styles.infoValue, { color: textColor }]}>1.0.0</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: secondaryTextColor }]}>App Name</Text>
            <Text style={[styles.infoValue, { color: textColor }]}>Magick</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: secondaryTextColor }]}>Description</Text>
            <Text style={[styles.infoValue, { color: textColor }]}>
              Connect with your partner
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.uploadButton, { backgroundColor: colors.accent }]}
          onPress={() => Alert.alert('Upload Deck', 'Drag and drop a JSON file with your custom deck')}
        >
          <IconSymbol
            ios_icon_name="square.and.arrow.up"
            android_material_icon_name="upload"
            size={24}
            color="#FFFFFF"
          />
          <Text style={styles.uploadButtonText}>Upload Custom Deck (JSON)</Text>
        </TouchableOpacity>

        <Text style={[styles.uploadHint, { color: secondaryTextColor }]}>
          Upload a JSON file with your custom card deck. The file should contain an array of cards with id, text, type, deck, and tags fields.
        </Text>
      </ScrollView>
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 30,
  },
  section: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    flex: 1,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  refreshButton: {
    padding: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.textSecondary + '20',
  },
  infoLabel: {
    fontSize: 15,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  uploadHint: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 20,
  },
});
