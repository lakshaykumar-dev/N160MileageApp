import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import { THEME } from '../constants/bike';

const { width } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const bikeSlideAnim = useRef(new Animated.Value(30)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence of smooth entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(bikeSlideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    });

    // Auto dismiss after 2.2 seconds
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 2200);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, bikeSlideAnim, textFadeAnim, onFinish]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar barStyle="dark-content" />

      {/* Top Brand Header */}
      <View style={styles.topHeader}>
        <Text style={styles.brandSubtitle}>BAJAJ MOTORCYCLES</Text>
        <Text style={styles.appName}>PULSAR N160</Text>
        <View style={styles.goldBadge}>
          <Text style={styles.goldBadgeText}>2025 USD EDITION</Text>
        </View>
      </View>

      {/* Hero Bike Image with shadow */}
      <Animated.View
        style={[
          styles.imageWrapper,
          {
            transform: [
              { scale: scaleAnim },
              { translateY: bikeSlideAnim },
            ],
          },
        ]}
      >
        <Image
          source={require('../assets/images/n160_usd.png')}
          style={styles.bikeImage}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Bottom Subtitle / Tagline */}
      <Animated.View style={[styles.bottomContainer, { opacity: textFadeAnim }]}>
        <Text style={styles.appTagline}>MILEAGE & RANGE INTELLIGENCE</Text>
        <View style={styles.specsRow}>
          <Text style={styles.specPill}>33mm Gold USD</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.specPill}>14L Tank</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.specPill}>Dual-Channel ABS</Text>
        </View>

        <View style={styles.cityPill}>
          <Text style={styles.cityText}>📍 Nagpur Fuel Rate Preset: ₹111.75 / L</Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  topHeader: {
    alignItems: 'center',
    marginTop: 20,
  },
  brandSubtitle: {
    color: THEME.textMuted,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2.5,
    marginBottom: 4,
  },
  appName: {
    color: THEME.textPrimary,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  goldBadge: {
    backgroundColor: THEME.accentGoldSoft,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  goldBadgeText: {
    color: THEME.accentGold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  imageWrapper: {
    width: width - 30,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bikeImage: {
    width: '100%',
    height: '100%',
  },
  bottomContainer: {
    alignItems: 'center',
    width: '100%',
  },
  appTagline: {
    color: THEME.accentRed,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  specsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  specPill: {
    color: THEME.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  dot: {
    color: THEME.border,
    marginHorizontal: 8,
    fontSize: 14,
  },
  cityPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  cityText: {
    color: THEME.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
});
