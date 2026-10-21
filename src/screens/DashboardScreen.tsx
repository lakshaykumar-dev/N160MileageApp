import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Image,
} from 'react-native';
import { THEME, SAMPLE_REFUELS, DEFAULT_NAGPUR_PETROL_PRICE } from '../constants/bike';
import { RefuelEntry } from '../types';
import {
  calculateRefuelsWithMetrics,
  computeSummaryStats,
} from '../utils/calculations';
import {
  getStoredRefuels,
  saveStoredRefuels,
  getLastFuelRate,
  saveLastFuelRate,
  clearAllRefuelData,
} from '../utils/storage';
import { Header } from '../components/Header';
import { MileageGauge } from '../components/MileageGauge';
import { MetricGrid } from '../components/MetricCard';
import { RangeEstimator } from '../components/RangeEstimator';
import { RefuelCard } from '../components/RefuelCard';
import { RefuelModal } from '../components/RefuelModal';
import { BikeSpecsModal } from '../components/BikeSpecsModal';

export const DashboardScreen: React.FC = () => {
  const [refuels, setRefuels] = useState<RefuelEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isSpecsModalOpen, setIsSpecsModalOpen] = useState<boolean>(false);
  const [lastFuelRate, setLastFuelRate] = useState<number>(DEFAULT_NAGPUR_PETROL_PRICE);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [storedRefuels, storedRate] = await Promise.all([
        getStoredRefuels(),
        getLastFuelRate(),
      ]);
      setRefuels(storedRefuels);
      setLastFuelRate(storedRate);
    } catch (error) {
      console.error('Failed to load refuels:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddRefuel = async (newEntryData: Omit<RefuelEntry, 'id'>) => {
    const newEntry: RefuelEntry = {
      ...newEntryData,
      id: `refuel_${Date.now()}`,
    };

    const updated = [...refuels, newEntry];
    setRefuels(updated);
    setLastFuelRate(newEntry.pricePerLiter);

    await Promise.all([
      saveStoredRefuels(updated),
      saveLastFuelRate(newEntry.pricePerLiter),
    ]);
  };

  const handleDeleteRefuel = async (id: string) => {
    const updated = refuels.filter(item => item.id !== id);
    setRefuels(updated);
    await saveStoredRefuels(updated);
  };

  const handleResetData = async () => {
    setRefuels([]);
    await clearAllRefuelData();
  };

  const handleLoadSampleData = async () => {
    setRefuels(SAMPLE_REFUELS);
    await saveStoredRefuels(SAMPLE_REFUELS);
  };

  const enrichedRefuels = calculateRefuelsWithMetrics(refuels);
  const stats = computeSummaryStats(refuels);

  const renderHeader = () => (
    <View>
      {/* Bike Showcase Banner */}
      <View style={styles.bikeBanner}>
        <View style={styles.bikeBannerContent}>
          <View style={styles.bikeInfoCol}>
            <View style={styles.usdBadge}>
              <Text style={styles.usdBadgeText}>33mm GOLD USD</Text>
            </View>
            <Text style={styles.bikeBannerTitle}>Pulsar N160</Text>
            <Text style={styles.bikeBannerSub}>164.82cc • 14L Tank</Text>
            <View style={styles.nagpurRateBadge}>
              <Text style={styles.nagpurRateText}>📍 Nagpur: ₹{DEFAULT_NAGPUR_PETROL_PRICE}/L</Text>
            </View>
          </View>
          <View style={styles.bikeImageWrapper}>
            <Image
              source={require('../assets/images/n160_usd.png')}
              style={styles.bannerBikeImage}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>

      <MileageGauge
        overallMileage={stats.overallMileage}
        totalDistance={stats.totalDistance}
        totalFuel={stats.totalFuel}
      />

      <MetricGrid stats={stats} />

      <RangeEstimator currentMileage={stats.overallMileage} />

      <View style={styles.historySectionHeader}>
        <View>
          <Text style={styles.historySectionSub}>ODOMETER TIMELINE</Text>
          <Text style={styles.historySectionTitle}>Refueling History</Text>
        </View>
        <View style={styles.logCountBadge}>
          <Text style={styles.logCountText}>{refuels.length} Logs</Text>
        </View>
      </View>
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={require('../assets/images/n160_usd.png')}
        style={styles.emptyBikeImage}
        resizeMode="contain"
      />
      <Text style={styles.emptyTitle}>Ready for your first ride log!</Text>
      <Text style={styles.emptySubtitle}>
        Add your current odometer reading after refueling your Pulsar N160 to begin tracking automatic mileage.
      </Text>
      <TouchableOpacity
        style={styles.emptyAddBtn}
        onPress={() => setIsAddModalOpen(true)}
      >
        <Text style={styles.emptyAddBtnText}>+ Add First Refuel</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Persistent App Header */}
      <Header
        currentOdo={stats.currentOdo}
        onOpenSpecs={() => setIsSpecsModalOpen(true)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {loading ? (
        <View style={styles.loaderCenter}>
          <ActivityIndicator size="large" color={THEME.accentRed} />
          <Text style={styles.loadingText}>Syncing N160 Odometer Logs...</Text>
        </View>
      ) : (
        <FlatList
          data={enrichedRefuels}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <RefuelCard entry={item} onDelete={handleDeleteRefuel} />
          )}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyComponent}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setIsAddModalOpen(true)}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>⛽ +</Text>
      </TouchableOpacity>

      {/* Add Refuel Modal */}
      <RefuelModal
        visible={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddRefuel}
        lastOdometer={stats.currentOdo}
        lastFuelRate={lastFuelRate}
      />

      {/* Motorcycle Specs & Settings Modal */}
      <BikeSpecsModal
        visible={isSpecsModalOpen}
        onClose={() => setIsSpecsModalOpen(false)}
        onResetData={handleResetData}
        onLoadSampleData={handleLoadSampleData}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg,
  },
  loaderCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: THEME.textSecondary,
    fontSize: 13,
    marginTop: 10,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 90,
  },
  historySectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 8,
  },
  historySectionSub: {
    color: THEME.textMuted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  historySectionTitle: {
    color: THEME.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  logCountBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  logCountText: {
    color: THEME.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  bikeBanner: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: THEME.border,
    padding: 16,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  bikeBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bikeInfoCol: {
    flex: 1,
    paddingRight: 10,
  },
  usdBadge: {
    backgroundColor: THEME.accentGoldSoft,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  usdBadgeText: {
    color: THEME.accentGold,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  bikeBannerTitle: {
    color: THEME.textPrimary,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  bikeBannerSub: {
    color: THEME.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 6,
  },
  nagpurRateBadge: {
    backgroundColor: '#EFF6FF',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  nagpurRateText: {
    color: '#2563EB',
    fontSize: 10,
    fontWeight: '700',
  },
  bikeImageWrapper: {
    width: 145,
    height: 95,
  },
  bannerBikeImage: {
    width: '100%',
    height: '100%',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  emptyBikeImage: {
    width: 200,
    height: 120,
    marginBottom: 10,
  },
  emptyTitle: {
    color: THEME.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptySubtitle: {
    color: THEME.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
  },
  emptyAddBtn: {
    backgroundColor: THEME.accentRed,
    paddingVertical: 11,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  emptyAddBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    backgroundColor: THEME.accentRed,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: THEME.accentRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
});
