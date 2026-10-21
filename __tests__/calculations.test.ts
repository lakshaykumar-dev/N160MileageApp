import {
  calculateRefuelsWithMetrics,
  computeSummaryStats,
  getMileageHealth,
} from '../src/utils/calculations';
import { RefuelEntry } from '../src/types';

describe('N160 Mileage Calculations Engine', () => {
  const mockEntries: RefuelEntry[] = [
    {
      id: '1',
      odometer: 1000,
      fuelLiters: 10,
      pricePerLiter: 100,
      totalAmount: 1000,
      isFullTank: true,
      date: '2026-10-01T10:00:00Z',
    },
    {
      id: '2',
      odometer: 1500, // 500 km trip
      fuelLiters: 10, // 500 / 10 = 50 km/L
      pricePerLiter: 100,
      totalAmount: 1000,
      isFullTank: true,
      date: '2026-10-05T10:00:00Z',
    },
    {
      id: '3',
      odometer: 1980, // 480 km trip
      fuelLiters: 10, // 480 / 10 = 48 km/L
      pricePerLiter: 100,
      totalAmount: 1000,
      isFullTank: true,
      date: '2026-10-10T10:00:00Z',
    },
  ];

  it('correctly calculates trip distance and interval mileage', () => {
    const enriched = calculateRefuelsWithMetrics(mockEntries);
    expect(enriched.length).toBe(3);

    // Latest entry should be mock 3
    const latest = enriched[0];
    expect(latest.odometer).toBe(1980);
    expect(latest.tripDistance).toBe(480);
    expect(latest.mileage).toBe(48.0);
    expect(latest.costPerKm).toBe(2.08);

    // Middle entry
    const middle = enriched[1];
    expect(middle.odometer).toBe(1500);
    expect(middle.tripDistance).toBe(500);
    expect(middle.mileage).toBe(50.0);
    expect(middle.costPerKm).toBe(2.0);

    // Baseline entry has no trip distance
    const first = enriched[2];
    expect(first.odometer).toBe(1000);
    expect(first.tripDistance).toBeUndefined();
    expect(first.mileage).toBeUndefined();
  });

  it('computes overall summary statistics accurately', () => {
    const stats = computeSummaryStats(mockEntries);
    // Total distance = (1500 - 1000) + (1980 - 1500) = 500 + 480 = 980 km
    expect(stats.totalDistance).toBe(980);
    // Total fuel for trips = 10 + 10 = 20 L
    expect(stats.overallMileage).toBe(49.0); // 980 / 20 = 49 km/L
    expect(stats.latestMileage).toBe(48.0);
    expect(stats.bestMileage).toBe(50.0);
    expect(stats.worstMileage).toBe(48.0);
    expect(stats.currentOdo).toBe(1980);
    expect(stats.estimatedFullTankRange).toBe(Math.round(49.0 * 14)); // 686 km
  });

  it('assigns correct health status based on N160 performance thresholds', () => {
    expect(getMileageHealth(52).label).toContain('Exceptional');
    expect(getMileageHealth(46).label).toContain('Optimal');
    expect(getMileageHealth(40).label).toContain('Moderate');
    expect(getMileageHealth(32).label).toContain('Needs Attention');
  });
});
