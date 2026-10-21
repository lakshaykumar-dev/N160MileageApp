export interface RefuelEntry {
  id: string;
  odometer: number; // in km
  fuelLiters: number; // in Liters
  pricePerLiter: number; // in currency/L
  totalAmount: number; // total cost
  isFullTank: boolean;
  date: string; // ISO string or readable date
  station?: string;
  notes?: string;

  // Computed values
  tripDistance?: number; // km since last refuel
  mileage?: number; // km / L
  costPerKm?: number; // currency / km
}

export interface SummaryStats {
  totalDistance: number; // km
  totalFuel: number; // Liters
  totalSpent: number; // ₹
  overallMileage: number; // km/L
  latestMileage: number; // km/L
  bestMileage: number; // km/L
  worstMileage: number; // km/L
  averageCostPerKm: number; // ₹/km
  currentOdo: number; // km
  estimatedFullTankRange: number; // km
  refuelCount: number;
}

export interface BikeProfile {
  brand: string;
  model: string;
  subModel: string;
  tankCapacityLiters: number;
  reserveCapacityLiters: number;
  engineDisplacement: string;
  claimedMileage: number;
  currencySymbol: string;
}
