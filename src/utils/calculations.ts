import { RefuelEntry, SummaryStats } from '../types';
import { N160_PROFILE } from '../constants/bike';

/**
 * Calculates trip distances, fuel efficiency (km/L), and cost per km for a list of refuel entries.
 * Returns entries sorted by date descending (newest first) with calculated fields attached.
 */
export function calculateRefuelsWithMetrics(rawEntries: RefuelEntry[]): RefuelEntry[] {
  if (!rawEntries || rawEntries.length === 0) {
    return [];
  }

  // Sort chronologically ascending by odometer first to calculate differences
  const sortedAsc = [...rawEntries].sort((a, b) => {
    if (a.odometer !== b.odometer) {
      return a.odometer - b.odometer;
    }
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const enriched: RefuelEntry[] = [];

  for (let i = 0; i < sortedAsc.length; i++) {
    const current = { ...sortedAsc[i] };

    if (i === 0) {
      // First baseline entry
      current.tripDistance = undefined;
      current.mileage = undefined;
      current.costPerKm = undefined;
    } else {
      const prev = sortedAsc[i - 1];
      const trip = current.odometer - prev.odometer;

      if (trip > 0) {
        current.tripDistance = trip;
        if (current.fuelLiters > 0) {
          current.mileage = Number((trip / current.fuelLiters).toFixed(2));
          current.costPerKm = Number((current.totalAmount / trip).toFixed(2));
        }
      }
    }

    enriched.push(current);
  }

  // Return in descending order for the feed (latest on top)
  return enriched.reverse();
}

/**
 * Aggregates lifetime summary statistics for the bike.
 */
export function computeSummaryStats(entries: RefuelEntry[]): SummaryStats {
  if (!entries || entries.length === 0) {
    return {
      totalDistance: 0,
      totalFuel: 0,
      totalSpent: 0,
      overallMileage: 0,
      latestMileage: 0,
      bestMileage: 0,
      worstMileage: 0,
      averageCostPerKm: 0,
      currentOdo: 0,
      estimatedFullTankRange: 0,
      refuelCount: 0,
    };
  }

  // Sort ascending by odometer
  const sortedAsc = [...entries].sort((a, b) => a.odometer - b.odometer);
  const currentOdo = sortedAsc[sortedAsc.length - 1].odometer;

  let totalTripDistance = 0;
  let totalFuelUsedForTrips = 0;
  let totalSpentOnTrips = 0;
  let allTotalSpent = 0;
  let allTotalFuel = 0;

  const validMileages: number[] = [];

  for (let i = 0; i < sortedAsc.length; i++) {
    const current = sortedAsc[i];
    allTotalSpent += current.totalAmount || 0;
    allTotalFuel += current.fuelLiters || 0;

    if (i > 0) {
      const prev = sortedAsc[i - 1];
      const trip = current.odometer - prev.odometer;
      if (trip > 0 && current.fuelLiters > 0) {
        totalTripDistance += trip;
        totalFuelUsedForTrips += current.fuelLiters;
        totalSpentOnTrips += current.totalAmount;
        const mileage = trip / current.fuelLiters;
        validMileages.push(mileage);
      }
    }
  }

  const overallMileage =
    totalFuelUsedForTrips > 0
      ? Number((totalTripDistance / totalFuelUsedForTrips).toFixed(2))
      : 0;

  const latestMileage =
    validMileages.length > 0
      ? Number(validMileages[validMileages.length - 1].toFixed(2))
      : 0;

  const bestMileage =
    validMileages.length > 0
      ? Number(Math.max(...validMileages).toFixed(2))
      : 0;

  const worstMileage =
    validMileages.length > 0
      ? Number(Math.min(...validMileages).toFixed(2))
      : 0;

  const averageCostPerKm =
    totalTripDistance > 0
      ? Number((totalSpentOnTrips / totalTripDistance).toFixed(2))
      : 0;

  const estimatedFullTankRange =
    overallMileage > 0
      ? Math.round(overallMileage * N160_PROFILE.tankCapacityLiters)
      : Math.round(N160_PROFILE.claimedMileage * N160_PROFILE.tankCapacityLiters);

  return {
    totalDistance: totalTripDistance,
    totalFuel: Number(allTotalFuel.toFixed(2)),
    totalSpent: Math.round(allTotalSpent),
    overallMileage,
    latestMileage,
    bestMileage,
    worstMileage,
    averageCostPerKm,
    currentOdo,
    estimatedFullTankRange,
    refuelCount: entries.length,
  };
}

/**
 * Format currency with Indian Rupee symbol
 */
export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  })}`;
}

/**
 * Mileage health feedback for Pulsar N160
 */
export function getMileageHealth(mileage: number): {
  label: string;
  color: string;
  description: string;
} {
  if (mileage >= 50) {
    return {
      label: 'Exceptional (50+ km/L)',
      color: '#10B981',
      description: 'Highway / Eco Riding Mode',
    };
  }
  if (mileage >= 44) {
    return {
      label: 'Optimal (44-50 km/L)',
      color: '#38BDF8',
      description: 'Ideal City & Commute Performance',
    };
  }
  if (mileage >= 38) {
    return {
      label: 'Moderate (38-44 km/L)',
      color: '#F59E0B',
      description: 'Sporty riding or heavy stop-and-go traffic',
    };
  }
  return {
    label: 'Needs Attention (<38 km/L)',
    color: '#EF4444',
    description: 'Check tyre pressure, chain lube, or fuel quality',
  };
}
