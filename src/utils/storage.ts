import AsyncStorage from '@react-native-async-storage/async-storage';
import { RefuelEntry } from '../types';
import { DEFAULT_NAGPUR_PETROL_PRICE } from '../constants/bike';

const STORAGE_KEY = '@n160_refuel_logs_v1';
const LAST_RATE_KEY = '@n160_last_fuel_rate_v1';

export async function getStoredRefuels(): Promise<RefuelEntry[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) {
      return [];
    }
    const parsed: RefuelEntry[] = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error reading refuel logs from storage:', error);
    return [];
  }
}

export async function saveStoredRefuels(entries: RefuelEntry[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Error saving refuel logs to storage:', error);
  }
}

export async function saveLastFuelRate(rate: number): Promise<void> {
  try {
    await AsyncStorage.setItem(LAST_RATE_KEY, rate.toString());
  } catch (error) {
    console.error('Error saving last fuel rate:', error);
  }
}

export async function getLastFuelRate(): Promise<number> {
  try {
    const val = await AsyncStorage.getItem(LAST_RATE_KEY);
    return val ? parseFloat(val) : DEFAULT_NAGPUR_PETROL_PRICE;
  } catch {
    return DEFAULT_NAGPUR_PETROL_PRICE;
  }
}

export async function clearAllRefuelData(): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  } catch (error) {
    console.error('Error clearing data:', error);
  }
}
