import { BikeProfile, RefuelEntry } from '../types';

export const N160_PROFILE: BikeProfile = {
  brand: 'Bajaj',
  model: 'Pulsar N160',
  subModel: '2025 USD Edition',
  tankCapacityLiters: 14.0,
  reserveCapacityLiters: 2.5,
  engineDisplacement: '164.82 cc Dual-Spark DTS-i',
  claimedMileage: 51.5,
  currencySymbol: '₹',
};

export const DEFAULT_NAGPUR_PETROL_PRICE = 111.75; // Nagpur current petrol price (₹/L)

export const THEME = {
  bg: '#F8FAFC',
  bgCard: '#FFFFFF',
  bgCardSecondary: '#F1F5F9',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  accentRed: '#E11D48',
  accentRedDark: '#BE123C',
  accentRedSoft: '#FFE4E6',
  accentGold: '#B45309',
  accentGoldSoft: '#FEF3C7',
  accentBlue: '#2563EB',
  accentBlueSoft: '#EFF6FF',
  accentGreen: '#059669',
  accentGreenSoft: '#ECFDF5',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  surfaceLight: '#F8FAFC',
};

export const SAMPLE_REFUELS: RefuelEntry[] = [
  {
    id: 'sample-1',
    odometer: 1120,
    fuelLiters: 10.0,
    pricePerLiter: 102.5,
    totalAmount: 1025,
    isFullTank: true,
    date: new Date(Date.now() - 15 * 86400000).toISOString(),
    station: 'Shell V-Power',
    notes: 'Initial full tank fill after 1st service',
  },
  {
    id: 'sample-2',
    odometer: 1595,
    fuelLiters: 9.8,
    pricePerLiter: 102.8,
    totalAmount: 1007.44,
    isFullTank: true,
    date: new Date(Date.now() - 9 * 86400000).toISOString(),
    station: 'Indian Oil (XP95)',
    notes: 'City commute + Western Express Highway',
  },
  {
    id: 'sample-3',
    odometer: 2090,
    fuelLiters: 10.1,
    pricePerLiter: 103.0,
    totalAmount: 1040.3,
    isFullTank: true,
    date: new Date(Date.now() - 3 * 86400000).toISOString(),
    station: 'Bharat Petroleum',
    notes: 'Weekend breakfast ride to Lonavala',
  },
  {
    id: 'sample-4',
    odometer: 2415,
    fuelLiters: 6.5,
    pricePerLiter: 103.2,
    totalAmount: 670.8,
    isFullTank: true,
    date: new Date().toISOString(),
    station: 'HP AutoCare',
    notes: 'Quick refill before office week',
  },
];
