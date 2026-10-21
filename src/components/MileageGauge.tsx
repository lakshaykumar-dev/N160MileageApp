import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { THEME, N160_PROFILE } from '../constants/bike';
import { getMileageHealth } from '../utils/calculations';

interface MileageGaugeProps {
  overallMileage: number;
  totalDistance: number;
  totalFuel: number;
}

export const MileageGauge: React.FC<MileageGaugeProps> = ({
  overallMileage,
  totalDistance,
  totalFuel,
}) => {
  const health = getMileageHealth(overallMileage);
  const claimedMileage = N160_PROFILE.claimedMileage;

  // Max scale is 65 km/L
  const maxMileage = 65;
  const clampedMileage = Math.min(Math.max(overallMileage, 0), maxMileage);

  // SVG Gauge calculations (semi-circle arc)
  const size = 200;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = Math.PI * radius;
  const progressPercent = clampedMileage / maxMileage;
  const strokeDashoffset = circumference * (1 - progressPercent);

  // Comparison difference with claimed
  const diffFromClaimed =
    overallMileage > 0 ? (overallMileage - claimedMileage).toFixed(1) : '0';
  const isAboveClaimed = Number(diffFromClaimed) >= 0;

  return (
    <View style={styles.card}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.cardSub}>AVERAGE FUEL EFFICIENCY</Text>
          <Text style={styles.cardTitle}>Real-World Mileage</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: `${health.color}15` },
          ]}
        >
          <View style={[styles.statusDot, { backgroundColor: health.color }]} />
          <Text style={[styles.statusText, { color: health.color }]}>
            {overallMileage > 0 ? health.label : 'Awaiting 2nd Fill'}
          </Text>
        </View>
      </View>

      {/* Speedometer Arc Visual */}
      <View style={styles.gaugeWrapper}>
        <Svg
          width={size}
          height={size / 2 + 25}
          viewBox={`0 0 ${size} ${size / 2 + 25}`}
        >
          <Defs>
            <LinearGradient id="lightGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#EF4444" />
              <Stop offset="35%" stopColor="#F59E0B" />
              <Stop offset="70%" stopColor="#0284C7" />
              <Stop offset="100%" stopColor="#059669" />
            </LinearGradient>
          </Defs>

          {/* Background track (semi-circle) */}
          <Path
            d={`M ${strokeWidth / 2} ${center} A ${radius} ${radius} 0 0 1 ${
              size - strokeWidth / 2
            } ${center}`}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Active progress arc */}
          {overallMileage > 0 && (
            <Path
              d={`M ${strokeWidth / 2} ${center} A ${radius} ${radius} 0 0 1 ${
                size - strokeWidth / 2
              } ${center}`}
              fill="none"
              stroke="url(#lightGaugeGrad)"
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          )}
        </Svg>

        {/* Big Mileage Value in Center */}
        <View style={styles.gaugeValueOverlay}>
          <Text style={styles.mileageNumber}>
            {overallMileage > 0 ? overallMileage.toFixed(1) : '--'}
          </Text>
          <Text style={styles.mileageUnit}>KM / LITER</Text>
        </View>
      </View>

      {/* Clean Benchmark Row */}
      <View style={styles.benchmarkRow}>
        <View style={styles.benchmarkItem}>
          <Text style={styles.benchmarkLabel}>Factory Spec</Text>
          <Text style={styles.benchmarkValue}>{claimedMileage} km/L</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.benchmarkItem}>
          <Text style={styles.benchmarkLabel}>Variance</Text>
          <Text
            style={[
              styles.benchmarkValue,
              { color: isAboveClaimed ? '#059669' : '#D97706' },
            ]}
          >
            {overallMileage > 0
              ? `${isAboveClaimed ? '+' : ''}${diffFromClaimed} km/L`
              : '--'}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.benchmarkItem}>
          <Text style={styles.benchmarkLabel}>Total Fuel</Text>
          <Text style={styles.benchmarkValue}>{totalFuel} L</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: THEME.border,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardSub: {
    color: THEME.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  cardTitle: {
    color: THEME.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
    letterSpacing: -0.3,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  gaugeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    position: 'relative',
    height: 130,
  },
  gaugeValueOverlay: {
    position: 'absolute',
    bottom: 8,
    alignItems: 'center',
  },
  mileageNumber: {
    color: THEME.textPrimary,
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: -1,
  },
  mileageUnit: {
    color: THEME.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginTop: -2,
  },
  benchmarkRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginTop: 12,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  benchmarkItem: {
    alignItems: 'center',
    flex: 1,
  },
  benchmarkLabel: {
    color: THEME.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  benchmarkValue: {
    color: THEME.textPrimary,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 3,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
});
