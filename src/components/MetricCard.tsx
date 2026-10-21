import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../constants/bike';
import { SummaryStats } from '../types';

interface MetricGridProps {
  stats: SummaryStats;
}

export const MetricGrid: React.FC<MetricGridProps> = ({ stats }) => {
  return (
    <View style={styles.gridContainer}>
      {/* Metric 1: Latest Mileage */}
      <View style={styles.metricCard}>
        <View style={styles.headerRow}>
          <View style={[styles.iconBg, { backgroundColor: '#EFF6FF' }]}>
            <Text style={styles.metricIcon}>⚡</Text>
          </View>
          <Text style={styles.metricTitle}>LAST REFUEL</Text>
        </View>
        <Text style={styles.metricValue}>
          {stats.latestMileage > 0 ? `${stats.latestMileage}` : '--'}
          <Text style={styles.metricUnit}> km/L</Text>
        </Text>
        <Text style={styles.metricSub}>Latest fill-up</Text>
      </View>

      {/* Metric 2: Running Cost */}
      <View style={styles.metricCard}>
        <View style={styles.headerRow}>
          <View style={[styles.iconBg, { backgroundColor: '#ECFDF5' }]}>
            <Text style={styles.metricIcon}>₹</Text>
          </View>
          <Text style={styles.metricTitle}>RUNNING COST</Text>
        </View>
        <Text style={styles.metricValue}>
          {stats.averageCostPerKm > 0 ? `₹${stats.averageCostPerKm}` : '--'}
          <Text style={styles.metricUnit}> /km</Text>
        </Text>
        <Text style={styles.metricSub}>Avg cost per km</Text>
      </View>

      {/* Metric 3: Full Tank Range */}
      <View style={styles.metricCard}>
        <View style={styles.headerRow}>
          <View style={[styles.iconBg, { backgroundColor: '#FFFBEB' }]}>
            <Text style={styles.metricIcon}>🎯</Text>
          </View>
          <Text style={styles.metricTitle}>TANK RANGE</Text>
        </View>
        <Text style={styles.metricValue}>
          ~{stats.estimatedFullTankRange}
          <Text style={styles.metricUnit}> km</Text>
        </Text>
        <Text style={styles.metricSub}>14L capacity</Text>
      </View>

      {/* Metric 4: Total Distance */}
      <View style={styles.metricCard}>
        <View style={styles.headerRow}>
          <View style={[styles.iconBg, { backgroundColor: '#F5F3FF' }]}>
            <Text style={styles.metricIcon}>🛣️</Text>
          </View>
          <Text style={styles.metricTitle}>TRACKED DISTANCE</Text>
        </View>
        <Text style={styles.metricValue}>
          {stats.totalDistance.toLocaleString('en-IN')}
          <Text style={styles.metricUnit}> km</Text>
        </Text>
        <Text style={styles.metricSub}>{stats.refuelCount} logs recorded</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginTop: 10,
    justifyContent: 'space-between',
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    width: '48%',
    borderRadius: 16,
    padding: 14,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: THEME.border,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconBg: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  metricIcon: {
    fontSize: 12,
  },
  metricTitle: {
    color: THEME.textMuted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  metricValue: {
    color: THEME.textPrimary,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  metricUnit: {
    color: THEME.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  metricSub: {
    color: THEME.textMuted,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
});
