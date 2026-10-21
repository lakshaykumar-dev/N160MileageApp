import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { THEME } from '../constants/bike';

interface HeaderProps {
  currentOdo: number;
  onOpenSpecs: () => void;
  onOpenAddModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentOdo,
  onOpenSpecs,
  onOpenAddModal,
}) => {
  return (
    <View style={styles.container}>
      {/* Top Brand Row */}
      <View style={styles.topRow}>
        <View style={styles.brandContainer}>
          <View style={styles.brandBadgeRow}>
            <Text style={styles.brandText}>BAJAJ</Text>
            <View style={styles.goldForkBadge}>
              <Text style={styles.goldForkText}>33mm USD</Text>
            </View>
          </View>
          <Text style={styles.bikeModelTitle}>Pulsar N160</Text>
          <Text style={styles.modelYearSubtitle}>2025 USD Edition • 14L Tank</Text>
        </View>

        <TouchableOpacity
          style={styles.specsButton}
          onPress={onOpenSpecs}
          activeOpacity={0.7}
        >
          <Text style={styles.specsIcon}>⚙️</Text>
          <Text style={styles.specsText}>Specs</Text>
        </TouchableOpacity>
      </View>

      {/* Clean Minimalist ODO Counter Card */}
      <View style={styles.odoCard}>
        <View style={styles.odoLeft}>
          <Text style={styles.odoLabel}>ODOMETER READING</Text>
          <View style={styles.odoValueRow}>
            <Text style={styles.odoValue}>
              {currentOdo.toLocaleString('en-IN')}
            </Text>
            <Text style={styles.odoUnit}>KM</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={onOpenAddModal}
          activeOpacity={0.8}
        >
          <Text style={styles.addBtnIcon}>⛽ +</Text>
          <Text style={styles.addBtnText}>Add Refuel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  brandContainer: {
    flex: 1,
  },
  brandBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  brandText: {
    color: THEME.textMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginRight: 8,
  },
  goldForkBadge: {
    backgroundColor: THEME.accentGoldSoft,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  goldForkText: {
    color: THEME.accentGold,
    fontSize: 10,
    fontWeight: '700',
  },
  bikeModelTitle: {
    color: THEME.textPrimary,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  modelYearSubtitle: {
    color: THEME.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  specsButton: {
    backgroundColor: THEME.bgCardSecondary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.border,
  },
  specsIcon: {
    fontSize: 13,
    marginRight: 5,
  },
  specsText: {
    color: THEME.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  odoCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  odoLeft: {
    flex: 1,
  },
  odoLabel: {
    color: THEME.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  odoValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  odoValue: {
    color: THEME.textPrimary,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  odoUnit: {
    color: THEME.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
  addBtn: {
    backgroundColor: THEME.accentRed,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: THEME.accentRed,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  addBtnIcon: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    marginRight: 6,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
