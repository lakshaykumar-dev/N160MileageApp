import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { THEME, DEFAULT_NAGPUR_PETROL_PRICE } from '../constants/bike';
import { RefuelEntry } from '../types';

interface RefuelModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (entry: Omit<RefuelEntry, 'id'>) => void;
  lastOdometer: number;
  lastFuelRate: number;
}

export const RefuelModal: React.FC<RefuelModalProps> = ({
  visible,
  onClose,
  onSave,
  lastOdometer,
  lastFuelRate,
}) => {
  const [odometer, setOdometer] = useState<string>('');
  const [liters, setLiters] = useState<string>('');
  const [rate, setRate] = useState<string>(
    lastFuelRate ? lastFuelRate.toString() : DEFAULT_NAGPUR_PETROL_PRICE.toString(),
  );
  const [totalAmount, setTotalAmount] = useState<string>('');
  const [isFullTank, setIsFullTank] = useState<boolean>(true);
  const [station, setStation] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (visible) {
      setOdometer('');
      setLiters('');
      setRate(lastFuelRate ? lastFuelRate.toString() : DEFAULT_NAGPUR_PETROL_PRICE.toString());
      setTotalAmount('');
      setIsFullTank(true);
      setStation('');
      setNotes('');
    }
  }, [visible, lastFuelRate]);

  // Handle Liters change -> update Total Amount
  const handleLitersChange = (text: string) => {
    setLiters(text);
    const parsedLiters = parseFloat(text);
    const parsedRate = parseFloat(rate);
    if (!isNaN(parsedLiters) && !isNaN(parsedRate) && parsedRate > 0) {
      setTotalAmount((parsedLiters * parsedRate).toFixed(2));
    }
  };

  // Handle Amount change -> update Liters
  const handleAmountChange = (text: string) => {
    setTotalAmount(text);
    const parsedAmount = parseFloat(text);
    const parsedRate = parseFloat(rate);
    if (!isNaN(parsedAmount) && !isNaN(parsedRate) && parsedRate > 0) {
      setLiters((parsedAmount / parsedRate).toFixed(2));
    }
  };

  // Handle Rate change -> update Amount based on Liters
  const handleRateChange = (text: string) => {
    setRate(text);
    const parsedRate = parseFloat(text);
    const parsedLiters = parseFloat(liters);
    if (!isNaN(parsedRate) && !isNaN(parsedLiters)) {
      setTotalAmount((parsedLiters * parsedRate).toFixed(2));
    }
  };

  const handleQuickAmount = (amount: number) => {
    const parsedRate = parseFloat(rate) || DEFAULT_NAGPUR_PETROL_PRICE;
    setTotalAmount(amount.toString());
    setLiters((amount / parsedRate).toFixed(2));
  };

  const handleQuickFullTank = () => {
    setIsFullTank(true);
    const parsedRate = parseFloat(rate) || DEFAULT_NAGPUR_PETROL_PRICE;
    const tankLiters = 11.5;
    setLiters(tankLiters.toString());
    setTotalAmount((tankLiters * parsedRate).toFixed(2));
  };

  const parsedOdo = parseFloat(odometer);
  const parsedLiters = parseFloat(liters);
  const parsedTotal = parseFloat(totalAmount);

  const tripDist = !isNaN(parsedOdo) && lastOdometer > 0 ? parsedOdo - lastOdometer : null;
  const previewMileage =
    tripDist !== null && tripDist > 0 && !isNaN(parsedLiters) && parsedLiters > 0
      ? (tripDist / parsedLiters).toFixed(2)
      : null;
  const previewCostPerKm =
    tripDist !== null && tripDist > 0 && !isNaN(parsedTotal) && parsedTotal > 0
      ? (parsedTotal / tripDist).toFixed(2)
      : null;

  const handleSave = () => {
    if (isNaN(parsedOdo) || parsedOdo <= 0) {
      Alert.alert('Invalid Odometer', 'Please enter a valid odometer reading in KM.');
      return;
    }

    if (lastOdometer > 0 && parsedOdo <= lastOdometer) {
      Alert.alert(
        'Odometer Lower Than Previous',
        `Current odometer (${parsedOdo} KM) must be greater than previous reading (${lastOdometer} KM).`,
      );
      return;
    }

    if (isNaN(parsedLiters) || parsedLiters <= 0) {
      Alert.alert('Invalid Fuel', 'Please enter fuel volume in Liters.');
      return;
    }

    const currentRate = parseFloat(rate) || DEFAULT_NAGPUR_PETROL_PRICE;
    const finalAmount = !isNaN(parsedTotal) && parsedTotal > 0 ? parsedTotal : parsedLiters * currentRate;

    onSave({
      odometer: parsedOdo,
      fuelLiters: Number(parsedLiters.toFixed(2)),
      pricePerLiter: Number(currentRate.toFixed(2)),
      totalAmount: Number(finalAmount.toFixed(2)),
      isFullTank,
      date: new Date().toISOString(),
      station: station.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalSubTitle}>PULSAR N160 2025 USD</Text>
              <Text style={styles.modalTitle}>Add Refueling Log</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            {/* Odometer Field */}
            <View style={styles.fieldGroup}>
              <View style={styles.fieldHeaderRow}>
                <Text style={styles.fieldLabel}>CURRENT ODOMETER (KM) *</Text>
                {lastOdometer > 0 && (
                  <Text style={styles.prevOdoHint}>
                    Last: {lastOdometer.toLocaleString('en-IN')} KM
                  </Text>
                )}
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInputMain}
                  placeholder={lastOdometer > 0 ? `${lastOdometer + 250}` : 'e.g. 1500'}
                  placeholderTextColor={THEME.textMuted}
                  keyboardType="numeric"
                  value={odometer}
                  onChangeText={setOdometer}
                  autoFocus
                />
                <Text style={styles.inputAffix}>KM</Text>
              </View>
            </View>

            {/* Quick Fill Presets */}
            <View style={styles.presetsContainer}>
              <Text style={styles.presetsLabel}>QUICK FILL PRESETS</Text>
              <View style={styles.presetButtonsRow}>
                <TouchableOpacity
                  style={styles.chip}
                  onPress={() => handleQuickAmount(200)}
                >
                  <Text style={styles.chipText}>₹200</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.chip}
                  onPress={() => handleQuickAmount(500)}
                >
                  <Text style={styles.chipText}>₹500</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.chip}
                  onPress={() => handleQuickAmount(1000)}
                >
                  <Text style={styles.chipText}>₹1,000</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.chip, styles.chipFullTank]}
                  onPress={handleQuickFullTank}
                >
                  <Text style={styles.chipFullTankText}>Full Tank</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Fuel Liters and Petrol Rate in 2 Columns */}
            <View style={styles.twoColRow}>
              <View style={styles.halfCol}>
                <Text style={styles.fieldLabel}>FUEL AMOUNT (L) *</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. 5.5"
                    placeholderTextColor={THEME.textMuted}
                    keyboardType="decimal-pad"
                    value={liters}
                    onChangeText={handleLitersChange}
                  />
                  <Text style={styles.inputAffix}>L</Text>
                </View>
              </View>

              <View style={styles.halfCol}>
                <Text style={styles.fieldLabel}>RATE (₹ / L) • NAGPUR</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="111.75"
                    placeholderTextColor={THEME.textMuted}
                    keyboardType="decimal-pad"
                    value={rate}
                    onChangeText={handleRateChange}
                  />
                  <Text style={styles.inputAffix}>₹/L</Text>
                </View>
              </View>
            </View>

            {/* Total Cost Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>TOTAL AMOUNT PAID (₹)</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. 560"
                  placeholderTextColor={THEME.textMuted}
                  keyboardType="decimal-pad"
                  value={totalAmount}
                  onChangeText={handleAmountChange}
                />
                <Text style={styles.inputAffix}>₹</Text>
              </View>
            </View>

            {/* Full Tank Toggle */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleTextContainer}>
                <Text style={styles.toggleTitle}>Full Tank Refuel</Text>
                <Text style={styles.toggleSub}>
                  Recommended for highest accuracy
                </Text>
              </View>
              <Switch
                value={isFullTank}
                onValueChange={setIsFullTank}
                trackColor={{ false: '#E2E8F0', true: '#10B981' }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Live Calculation Preview Box */}
            {tripDist !== null && tripDist > 0 && (
              <View style={styles.previewBox}>
                <Text style={styles.previewTitle}>⚡ LIVE TRIP PREVIEW</Text>
                <View style={styles.previewMetrics}>
                  <View style={styles.previewMetricItem}>
                    <Text style={styles.prevMetricLabel}>Distance</Text>
                    <Text style={styles.prevMetricVal}>+{tripDist} KM</Text>
                  </View>
                  <View style={styles.prevDivider} />
                  <View style={styles.previewMetricItem}>
                    <Text style={styles.prevMetricLabel}>Mileage</Text>
                    <Text style={[styles.prevMetricVal, { color: '#059669' }]}>
                      {previewMileage ? `${previewMileage} km/L` : '--'}
                    </Text>
                  </View>
                  <View style={styles.prevDivider} />
                  <View style={styles.previewMetricItem}>
                    <Text style={styles.prevMetricLabel}>Cost / KM</Text>
                    <Text style={styles.prevMetricVal}>
                      {previewCostPerKm ? `₹${previewCostPerKm}/km` : '--'}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Station / Pump Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>FUEL STATION / BRAND (OPTIONAL)</Text>
              <TextInput
                style={styles.textInputSmall}
                placeholder="e.g. Shell V-Power, Indian Oil XP95, HP, BPCL"
                placeholderTextColor={THEME.textMuted}
                value={station}
                onChangeText={setStation}
              />
            </View>

            {/* Notes */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>RIDE NOTES (OPTIONAL)</Text>
              <TextInput
                style={styles.textInputSmall}
                placeholder="e.g. Highway cruise, City traffic, Tyre pressure 28/32 psi"
                placeholderTextColor={THEME.textMuted}
                value={notes}
                onChangeText={setNotes}
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Text style={styles.submitBtnText}>Save Refuel & Calculate</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 28,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  modalSubTitle: {
    color: THEME.accentRed,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  modalTitle: {
    color: THEME.textPrimary,
    fontSize: 22,
    fontWeight: '900',
    marginTop: 2,
    letterSpacing: -0.4,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: THEME.textSecondary,
    fontSize: 14,
    fontWeight: '800',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  fieldHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  fieldLabel: {
    color: THEME.textSecondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  prevOdoHint: {
    color: THEME.accentGold,
    fontSize: 11,
    fontWeight: '700',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  textInputMain: {
    flex: 1,
    color: THEME.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    paddingVertical: 12,
  },
  textInput: {
    flex: 1,
    color: THEME.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    paddingVertical: 11,
  },
  textInputSmall: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    color: THEME.textPrimary,
    fontSize: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  inputAffix: {
    color: THEME.textMuted,
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 6,
  },
  presetsContainer: {
    marginBottom: 14,
  },
  presetsLabel: {
    color: THEME.textMuted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  presetButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chip: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipText: {
    color: THEME.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  chipFullTank: {
    borderColor: '#A7F3D0',
    backgroundColor: '#ECFDF5',
  },
  chipFullTankText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '700',
  },
  twoColRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  halfCol: {
    width: '48%',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  toggleTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  toggleTitle: {
    color: THEME.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  toggleSub: {
    color: THEME.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  previewBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    padding: 14,
    marginBottom: 14,
  },
  previewTitle: {
    color: '#059669',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
  },
  previewMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  previewMetricItem: {
    alignItems: 'center',
  },
  prevMetricLabel: {
    color: '#65A30D',
    fontSize: 10,
    fontWeight: '600',
  },
  prevMetricVal: {
    color: THEME.textPrimary,
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  prevDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#BBF7D0',
  },
  submitBtn: {
    backgroundColor: THEME.accentRed,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: THEME.accentRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
