import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { THEME } from '../constants/bike';

interface BikeSpecsModalProps {
  visible: boolean;
  onClose: () => void;
  onResetData: () => void;
  onLoadSampleData: () => void;
}

export const BikeSpecsModal: React.FC<BikeSpecsModalProps> = ({
  visible,
  onClose,
  onResetData,
  onLoadSampleData,
}) => {
  const handleResetPress = () => {
    Alert.alert(
      'Reset All Mileage Data',
      'Are you sure you want to delete all refueling entries and start fresh?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset All',
          style: 'destructive',
          onPress: () => {
            onResetData();
            onClose();
          },
        },
      ],
    );
  };

  const handleSamplePress = () => {
    Alert.alert(
      'Load Demo Data',
      'Load sample refuel entries for Bajaj Pulsar N160 USD 2025?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Load Demo',
          onPress: () => {
            onLoadSampleData();
            onClose();
          },
        },
      ],
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalSub}>MOTORCYCLE SPECIFICATIONS</Text>
              <Text style={styles.modalTitle}>Bajaj Pulsar N160 (2025 USD)</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Bike Photo Showcase */}
            <View style={styles.bikeImageWrapper}>
              <Image
                source={require('../assets/images/n160_usd.png')}
                style={styles.modalBikeImage}
                resizeMode="contain"
              />
            </View>

            {/* USD Feature Highlight Card */}
            <View style={styles.highlightCard}>
              <View style={styles.goldBadge}>
                <Text style={styles.goldBadgeText}>2025 USD UPGRADE</Text>
              </View>
              <Text style={styles.highlightTitle}>33mm Gold Upside-Down Forks</Text>
              <Text style={styles.highlightDesc}>
                Equipped with champagne gold inverted USD front suspension, digital Bluetooth-enabled console with turn-by-turn navigation, and dual-channel ABS.
              </Text>
            </View>

            {/* Spec items table */}
            <View style={styles.specTable}>
              <View style={styles.specRow}>
                <Text style={styles.specKey}>Fuel Tank Capacity</Text>
                <Text style={styles.specVal}>14.0 Liters</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specKey}>Reserve Fuel Level</Text>
                <Text style={[styles.specVal, { color: '#DC2626' }]}>2.5 Liters</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specKey}>Engine Displacement</Text>
                <Text style={styles.specVal}>164.82 cc Oil-Cooled</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specKey}>Peak Power</Text>
                <Text style={styles.specVal}>16 PS @ 8,750 RPM</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specKey}>Peak Torque</Text>
                <Text style={styles.specVal}>14.65 Nm @ 6,750 RPM</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specKey}>Braking Hardware</Text>
                <Text style={styles.specVal}>Dual-Channel ABS (300/230mm)</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specKey}>Claimed Mileage</Text>
                <Text style={[styles.specVal, { color: '#059669' }]}>
                  ~51.5 km/L (ARAI)
                </Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specKey}>Tyre Sizes</Text>
                <Text style={styles.specVal}>100/80-17 (F) / 130/70-17 (R)</Text>
              </View>
            </View>

            {/* Mileage Tips */}
            <View style={styles.tipsCard}>
              <Text style={styles.tipsTitle}>💡 TIPS TO MAXIMIZE N160 MILEAGE</Text>
              <Text style={styles.tipText}>
                • Maintain front tyre at 28 PSI, rear tyre at 32 PSI (or 35 PSI with pillion).
              </Text>
              <Text style={styles.tipText}>
                • Shift up around 4,500 - 5,500 RPM for best fuel economy.
              </Text>
              <Text style={styles.tipText}>
                • Clean and lube the drive chain every 500 KM.
              </Text>
              <Text style={styles.tipText}>
                • Avoid running on reserve (&lt;2.5L) frequently to protect the EFI fuel pump.
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.sampleDataBtn}
                onPress={handleSamplePress}
                activeOpacity={0.7}
              >
                <Text style={styles.sampleDataBtnText}>🔄 Reload Sample Logs</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.resetBtn}
                onPress={handleResetPress}
                activeOpacity={0.7}
              >
                <Text style={styles.resetBtnText}>🗑️ Clear All Data</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
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
    maxHeight: '85%',
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
  modalSub: {
    color: THEME.accentGold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  modalTitle: {
    color: THEME.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
    letterSpacing: -0.3,
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
    paddingBottom: 24,
  },
  bikeImageWrapper: {
    height: 180,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    padding: 8,
  },
  modalBikeImage: {
    width: '100%',
    height: '100%',
  },
  highlightCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  goldBadge: {
    backgroundColor: '#FEF3C7',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  goldBadgeText: {
    color: '#B45309',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  highlightTitle: {
    color: '#92400E',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  highlightDesc: {
    color: '#78350F',
    fontSize: 12,
    lineHeight: 18,
  },
  specTable: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  specKey: {
    color: THEME.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  specVal: {
    color: THEME.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  tipsCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  tipsTitle: {
    color: '#059669',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  tipText: {
    color: '#166534',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sampleDataBtn: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: THEME.border,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  sampleDataBtnText: {
    color: THEME.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  resetBtn: {
    flex: 1,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  resetBtnText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '700',
  },
});
