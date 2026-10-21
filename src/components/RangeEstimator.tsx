import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { THEME, N160_PROFILE } from '../constants/bike';

interface RangeEstimatorProps {
  currentMileage: number;
}

export const RangeEstimator: React.FC<RangeEstimatorProps> = ({ currentMileage }) => {
  const [selectedLiters, setSelectedLiters] = useState<number>(7.0);

  const effectiveMileage = currentMileage > 0 ? currentMileage : N160_PROFILE.claimedMileage;
  const estimatedKm = Math.round(selectedLiters * effectiveMileage);
  const tankPercent = Math.min(100, Math.round((selectedLiters / N160_PROFILE.tankCapacityLiters) * 100));
  const isReserve = selectedLiters <= N160_PROFILE.reserveCapacityLiters;

  const presets = [
    { label: 'Reserve (2.5L)', liters: 2.5 },
    { label: '₹500 (~4.5L)', liters: 4.5 },
    { label: 'Half (7L)', liters: 7.0 },
    { label: 'Full (14L)', liters: 14.0 },
  ];

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.subTitle}>14L TANK RANGE ESTIMATOR</Text>
          <Text style={styles.title}>Distance on Fuel</Text>
        </View>
        <View style={[styles.tankTag, isReserve && styles.reserveTag]}>
          <Text style={[styles.tankTagText, isReserve && styles.reserveTagText]}>
            {isReserve ? '⚠️ RESERVE' : `${tankPercent}% TANK`}
          </Text>
        </View>
      </View>

      {/* Main Result Box */}
      <View style={styles.resultBox}>
        <View style={styles.resultLeft}>
          <Text style={styles.distNumber}>{estimatedKm}</Text>
          <Text style={styles.distUnit}>KM ESTIMATED</Text>
        </View>
        <View style={styles.resultRight}>
          <Text style={styles.calcFormula}>
            {selectedLiters} L × {effectiveMileage.toFixed(1)} km/L
          </Text>
          <Text style={styles.calcSub}>
            {isReserve
              ? 'Warning: Fuel in reserve zone (<2.5L)'
              : 'Safe riding range before empty'}
          </Text>
        </View>
      </View>

      {/* Fuel Level Bar */}
      <View style={styles.tankBarBackground}>
        <View
          style={[
            styles.tankBarFill,
            {
              width: `${tankPercent}%`,
              backgroundColor: isReserve ? '#EF4444' : '#2563EB',
            },
          ]}
        />
        {/* Reserve line marker at 2.5/14 = 17.8% */}
        <View style={[styles.reserveMarker, { left: `${(2.5 / 14) * 100}%` }]} />
      </View>

      <View style={styles.tankLabels}>
        <Text style={styles.tankMinMax}>0 L</Text>
        <Text style={styles.reserveMarkText}>2.5L Reserve</Text>
        <Text style={styles.tankMinMax}>14.0 L (Full)</Text>
      </View>

      {/* Clean Preset Buttons */}
      <View style={styles.presetRow}>
        {presets.map(item => {
          const isSelected = selectedLiters === item.liters;
          return (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.presetBtn,
                isSelected && styles.presetBtnActive,
              ]}
              onPress={() => setSelectedLiters(item.liters)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.presetText,
                  isSelected && styles.presetTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: THEME.border,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subTitle: {
    color: THEME.textMuted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  title: {
    color: THEME.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  tankTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  reserveTag: {
    backgroundColor: '#FEE2E2',
  },
  tankTagText: {
    color: THEME.textSecondary,
    fontSize: 10,
    fontWeight: '700',
  },
  reserveTagText: {
    color: '#DC2626',
    fontWeight: '800',
  },
  resultBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  resultLeft: {
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    alignItems: 'center',
  },
  distNumber: {
    color: THEME.textPrimary,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1,
  },
  distUnit: {
    color: '#2563EB',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  resultRight: {
    flex: 1,
    paddingLeft: 14,
  },
  calcFormula: {
    color: THEME.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  calcSub: {
    color: THEME.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  tankBarBackground: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
    marginVertical: 4,
  },
  tankBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  reserveMarker: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#EF4444',
  },
  tankLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tankMinMax: {
    color: THEME.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  reserveMarkText: {
    color: '#EF4444',
    fontSize: 10,
    fontWeight: '700',
  },
  presetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  presetBtn: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingVertical: 8,
    marginHorizontal: 3,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  presetBtnActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  presetText: {
    color: THEME.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },
  presetTextActive: {
    color: '#2563EB',
    fontWeight: '800',
  },
});
