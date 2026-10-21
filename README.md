# Bajaj Pulsar N160 (2025 USD Edition) — Bike Mileage Calculator 🏍️⛽

A specialized Android CLI React Native application designed for the **Bajaj Pulsar N160 (2025 USD Edition)**. It tracks refueling logs based on the motorcycle's digital odometer readings and automatically computes fuel efficiency (km/L), trip distance, running cost per kilometer, and safe riding range.

---

## 🚀 Key Features

### 1. **Odometer-Based Fuel Efficiency Tracking**
- Record odometer reading (`KM`), petrol filled (`L`), price per liter (`₹/L`), and total amount.
- **Tank-to-Tank Calculation Method**: Automatically calculates trip distance between consecutive fills (`Current ODO - Previous ODO`) and fuel efficiency (`Trip Distance / Fuel Added`).
- **Running Cost Analysis**: Calculates cost-per-kilometer (`₹ / KM`) for each trip and overall lifetime average.

### 2. **Digital Console Speedometer HUD**
- Negative-LCD styled digital odometer display inspired by the Pulsar N160's digital instrument cluster.
- Semi-circular speedometer efficiency gauge color-coded with dynamic status badges:
  - 🟢 **Exceptional (50+ km/L)**: Highway / Eco riding mode.
  - 🔵 **Optimal (44 - 50 km/L)**: Ideal city and daily commute performance.
  - 🟡 **Moderate (38 - 44 km/L)**: Aggressive riding or heavy traffic.
  - 🔴 **Needs Attention (<38 km/L)**: Warning to check tyre pressure or chain lubrication.

### 3. **Smart Refueling Input Modal**
- **Dual-Way Auto-Calculation**: Enter Liters to auto-fill the total amount, or enter total amount (`₹500`) to auto-compute liters based on the current petrol rate.
- **Quick Fill Presets**: Quick tap buttons for `₹200`, `₹500`, `₹1,000`, and `Full Tank`.
- **Live Preview Box**: Shows instantaneous trip distance (`+250 KM`), projected mileage (`49.0 km/L`), and trip cost before saving.
- Odometer sanity check prevents accidental entries lower than previous readings.

### 4. **N160 14-Liter Tank Range Estimator**
- Visual fuel tank bar highlighting the **2.5 Liter Reserve Zone** and **14.0 Liter Total Capacity**.
- Instant range calculation: select fuel remaining (Reserve 2.5L, Half Tank 7L, Full Tank 14L) to see how far the N160 can travel on current real-world mileage.

### 5. **Motorcycle Technical Specs & Maintenance Tips**
- Embedded technical specs sheet for the 2025 USD edition:
  - 33mm Gold Inverted (USD) Front Forks
  - 164.82 cc Oil-Cooled Single-Cylinder Engine (16 PS / 14.65 Nm)
  - Dual-Channel ABS (300mm front / 230mm rear disc)
  - 14.0L Fuel Tank (2.5L reserve)
  - Recommended tyre pressure (28 PSI front / 32 PSI rear)
- 1-Tap **Reload Demo Data** and **Clear All Data** options.

### 6. **Offline Persistent Storage**
- Uses `@react-native-async-storage/async-storage` to securely retain all refuel records and last petrol rate offline on device.

---

## 🛠️ Project Structure

```
N160MileageApp/
├── App.tsx                     # Root App container with SafeAreaProvider
├── index.js                    # React Native app registration
├── package.json                # Dependencies and CLI scripts
├── jest.setup.js               # Jest mock setup
├── src/
│   ├── types/
│   │   └── index.ts            # RefuelEntry, SummaryStats, BikeProfile interfaces
│   ├── constants/
│   │   └── bike.ts             # N160 USD 2025 specs, UI theme, realistic demo logs
│   ├── utils/
│   │   ├── calculations.ts     # Mileage, trip, cost/km, and health status engine
│   │   └── storage.ts          # AsyncStorage persistence helper
│   ├── components/
│   │   ├── Header.tsx          # Digital console HUD & bike branding
│   │   ├── MileageGauge.tsx    # Semi-circle SVG speedometer gauge
│   │   ├── MetricCard.tsx      # 4-card key performance metrics grid
│   │   ├── RangeEstimator.tsx  # 14L tank visualizer and range projector
│   │   ├── RefuelCard.tsx      # Refueling log card with delete action
│   │   ├── RefuelModal.tsx     # Smart add-refuel form with instant preview
│   │   └── BikeSpecsModal.tsx  # N160 2025 USD specifications sheet
│   └── screens/
│       └── DashboardScreen.tsx # Main dashboard orchestrator
└── __tests__/
    ├── calculations.test.ts    # Unit test suite for mileage calculations
    └── App.test.tsx            # Snapshot and rendering test
```

---

## 📲 How to Run on Android

### Prerequisites
- Node.js (v20+)
- Android SDK installed (`$ANDROID_HOME` configured)
- Connected Android device with USB Debugging enabled, or an Android Emulator running.

### Quick Start Commands

1. **Navigate to the project directory**:
   ```bash
   cd N160MileageApp
   ```

2. **Start the Metro bundler**:
   ```bash
   npx react-native start
   ```

3. **Build and install on Android**:
   ```bash
   npx react-native run-android
   ```

### Running Automated Tests
To run unit and calculation test suites:
```bash
npm test
```
To run TypeScript type checks:
```bash
npx tsc --noEmit
```
