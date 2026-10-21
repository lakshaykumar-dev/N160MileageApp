import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { THEME } from '../constants/bike';
import { RefuelEntry } from '../types';
import { formatCurrency, getMileageHealth } from '../utils/calculations';

interface RefuelCardProps {
  entry: RefuelEntry;
  onDelete: (id: string) => void;
}

export const RefuelCard: React.FC<RefuelCardProps> = ({ entry, onDelete }) => {
  const handleDeletePress = () => {
    Alert.alert(
      'Delete Refuel Entry',
      `Delete log at ${entry.odometer.toLocaleString('en-IN')} KM?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(entry.id),
        },
      ],
    );
  };

  const health = entry.mileage ? getMileageHealth(entry.mileage) : null;
  const formattedDate = new Date(entry.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <View style={styles.card}>
      {/* Top row: Date & Full Tank Tag */}
      <View style={styles.topRow}>
        <View style={styles.dateRow}>
          <Text style={styles.dateText}>📅 {formattedDate}</Text>
          {entry.isFullTank && (
            <View style={styles.fullTankTag}>
              <Text style={styles.fullTankText}>FULL TANK</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          onPress={handleDeletePress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.deleteBtn}
        >
          <Text style={styles.deleteBtnText}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Main ODO & Mileage Row */}
      <View style={styles.mainRow}>
        {/* Left Column: Odometer & Trip */}
        <View style={styles.odoSection}>
          <Text style={styles.sectionLabel}>ODOMETER</Text>
          <Text style={styles.odoValue}>
            {entry.odometer.toLocaleString('en-IN')}{' '}
            <Text style={styles.unitText}>KM</Text>
          </Text>
          {entry.tripDistance !== undefined ? (
            <View style={styles.tripBadge}>
              <Text style={styles.tripBadgeText}>+{entry.tripDistance} km trip</Text>
            </View>
          ) : (
            <Text style={styles.initialText}>Baseline entry</Text>
          )}
        </View>

        {/* Right Column: Mileage Pill */}
        <View style={styles.mileageSection}>
          <Text style={styles.sectionLabel}>FUEL EFFICIENCY</Text>
          {entry.mileage !== undefined ? (
            <View
              style={[
                styles.mileageBadge,
                { backgroundColor: `${health?.color}15` },
              ]}
            >
              <Text style={[styles.mileageValue, { color: health?.color }]}>
                {entry.mileage.toFixed(1)}
              </Text>
              <Text style={[styles.mileageUnit, { color: health?.color }]}>
                {' '}KM/L
              </Text>
            </View>
          ) : (
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingText}>Initial Fill</Text>
            </View>
          )}
        </View>
      </View>

      {/* Details strip: Liters, Price, Cost per KM */}
      <View style={styles.detailsStrip}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Fuel Filled</Text>
          <Text style={styles.detailValue}>{entry.fuelLiters} L</Text>
        </View>

        <View style={styles.detailDivider} />

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Total Cost</Text>
          <Text style={styles.detailValue}>{formatCurrency(entry.totalAmount)}</Text>
        </View>

        <View style={styles.detailDivider} />

        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Cost / KM</Text>
          <Text style={styles.detailValue}>
            {entry.costPerKm ? `₹${entry.costPerKm}` : '--'}
          </Text>
        </View>
      </View>

      {/* Station / Notes if available */}
      {(entry.station || entry.notes) && (
        <View style={styles.notesContainer}>
          {entry.station ? (
            <Text style={styles.stationText}>📍 {entry.station}</Text>
          ) : null}
          {entry.notes ? (
            <Text style={styles.notesText}>"{entry.notes}"</Text>
          ) : null}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: THEME.border,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    color: THEME.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginRight: 8,
  },
  fullTankTag: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  fullTankText: {
    color: '#059669',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  deleteBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: {
    color: THEME.textMuted,
    fontSize: 12,
    fontWeight: '800',
  },
  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  odoSection: {
    flex: 1,
  },
  sectionLabel: {
    color: THEME.textMuted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  odoValue: {
    color: THEME.textPrimary,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  unitText: {
    color: THEME.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  tripBadge: {
    backgroundColor: '#EFF6FF',
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 3,
  },
  tripBadgeText: {
    color: '#2563EB',
    fontSize: 10,
    fontWeight: '700',
  },
  initialText: {
    color: THEME.textMuted,
    fontSize: 10,
    fontStyle: 'italic',
    marginTop: 2,
  },
  mileageSection: {
    alignItems: 'flex-end',
  },
  mileageBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 2,
  },
  mileageValue: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  mileageUnit: {
    fontSize: 10,
    fontWeight: '800',
  },
  pendingBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 2,
  },
  pendingText: {
    color: THEME.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  detailsStrip: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    color: THEME.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  detailValue: {
    color: THEME.textPrimary,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
  },
  detailDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E2E8F0',
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  stationText: {
    color: THEME.accentGold,
    fontSize: 11,
    fontWeight: '700',
    marginRight: 10,
  },
  notesText: {
    color: THEME.textSecondary,
    fontSize: 11,
    fontStyle: 'italic',
  },
});
