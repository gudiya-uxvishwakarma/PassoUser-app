import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
  Easing,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, spacing} from '../theme';

const {width, height} = Dimensions.get('window');

export const SplashScreen = ({navigation}) => {
  // Logo animations
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoBounce = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;

  // Text animations
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleScale = useRef(new Animated.Value(0.8)).current;
  
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = useRef(new Animated.Value(20)).current;

  // Decorative shapes animations
  const topLeftShape = useRef(new Animated.Value(0)).current;
  const topRightShape = useRef(new Animated.Value(0)).current;
  const bottomLeftShape = useRef(new Animated.Value(0)).current;
  const bottomRightShape = useRef(new Animated.Value(0)).current;

  // Floating icons animations
  const floatingIcon1 = useRef(new Animated.Value(0)).current;
  const floatingIcon2 = useRef(new Animated.Value(0)).current;
  const floatingIcon3 = useRef(new Animated.Value(0)).current;
  const floatingIcon4 = useRef(new Animated.Value(0)).current;
  const floatingIcon5 = useRef(new Animated.Value(0)).current;
  const floatingIcon6 = useRef(new Animated.Value(0)).current;

  // Sparkle animations
  const sparkle1 = useRef(new Animated.Value(0)).current;
  const sparkle2 = useRef(new Animated.Value(0)).current;
  const sparkle3 = useRef(new Animated.Value(0)).current;
  const sparkle4 = useRef(new Animated.Value(0)).current;
  const sparkle5 = useRef(new Animated.Value(0)).current;
  const sparkle6 = useRef(new Animated.Value(0)).current;

  // Pulse animation for logo glow
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start all animations in sequence
    Animated.sequence([
      // Step 1: Decorative shapes appear (0-1000ms)
      Animated.parallel([
        Animated.timing(topLeftShape, {
          toValue: 1,
          duration: 1000,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }),
        Animated.timing(topRightShape, {
          toValue: 1,
          duration: 1100,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }),
        Animated.timing(bottomLeftShape, {
          toValue: 1,
          duration: 1200,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }),
        Animated.timing(bottomRightShape, {
          toValue: 1,
          duration: 1300,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }),
      ]),

      // Step 2: Logo appears with spring and rotation (1000-1800ms)
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
      ]),

      // Step 3: Title appears with scale (1800-2400ms)
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.spring(titleScale, {
          toValue: 1,
          friction: 7,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),

      // Step 4: Subtitle appears (2400-2900ms)
      Animated.parallel([
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(subtitleTranslateY, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Continuous logo bounce
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoBounce, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoBounce, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Pulse animation for logo glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Floating icons animations
    const startFloatingAnimation = (animValue, delay, duration) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    startFloatingAnimation(floatingIcon1, 0, 2500);
    startFloatingAnimation(floatingIcon2, 400, 2800);
    startFloatingAnimation(floatingIcon3, 800, 2600);
    startFloatingAnimation(floatingIcon4, 1200, 3000);
    startFloatingAnimation(floatingIcon5, 1600, 2700);
    startFloatingAnimation(floatingIcon6, 2000, 2900);

    // Sparkle animations
    const startSparkleAnimation = (animValue, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    startSparkleAnimation(sparkle1, 0);
    startSparkleAnimation(sparkle2, 400);
    startSparkleAnimation(sparkle3, 800);
    startSparkleAnimation(sparkle4, 1200);
    startSparkleAnimation(sparkle5, 1600);
    startSparkleAnimation(sparkle6, 2000);

    // Navigate to Main screen after animation completes
    const timer = setTimeout(() => {
      navigation.replace('Main');
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigation]);

  const logoBounceTranslate = logoBounce.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const logoRotateInterpolate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const topLeftTranslate = topLeftShape.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 0],
  });

  const topRightTranslate = topRightShape.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  const bottomLeftTranslate = bottomLeftShape.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 0],
  });

  const bottomRightTranslate = bottomRightShape.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  const getFloatingTransform = (animValue) => {
    return animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -25],
    });
  };

  const getFloatingRotate = (animValue) => {
    return animValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '10deg'],
    });
  };

  const getSparkleOpacity = (animValue) => {
    return animValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 1, 0],
    });
  };

  const getSparkleScale = (animValue) => {
    return animValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.3, 1.5, 0.3],
    });
  };

  const getSparkleRotate = (animValue) => {
    return animValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor={colors.background} 
        translucent 
      />

      {/* Top Left Decorative Shape */}
      <Animated.View
        style={[
          styles.topLeftShape,
          {
            opacity: topLeftShape,
            transform: [{translateX: topLeftTranslate}, {translateY: topLeftTranslate}],
          },
        ]}>
        <View style={styles.shapeGradient1} />
      </Animated.View>

      {/* Top Right Decorative Shape */}
      <Animated.View
        style={[
          styles.topRightShape,
          {
            opacity: topRightShape,
            transform: [{translateX: topRightTranslate}, {translateY: topLeftTranslate}],
          },
        ]}>
        <View style={styles.shapeGradient2} />
      </Animated.View>

      {/* Bottom Left Decorative Shape */}
      <Animated.View
        style={[
          styles.bottomLeftShape,
          {
            opacity: bottomLeftShape,
            transform: [{translateX: bottomLeftTranslate}, {translateY: bottomRightTranslate}],
          },
        ]}>
        <View style={styles.shapeGradient3} />
      </Animated.View>

      {/* Bottom Right Decorative Shape */}
      <Animated.View
        style={[
          styles.bottomRightShape,
          {
            opacity: bottomRightShape,
            transform: [{translateX: bottomRightTranslate}, {translateY: bottomRightTranslate}],
          },
        ]}>
        <View style={styles.shapeGradient4} />
      </Animated.View>

      {/* Floating Icons with enhanced animations */}
      <Animated.View
        style={[
          styles.floatingIcon,
          styles.floatingIcon1,
          {
            opacity: floatingIcon1,
            transform: [
              {translateY: getFloatingTransform(floatingIcon1)},
              {rotate: getFloatingRotate(floatingIcon1)},
            ],
          },
        ]}>
        <Icon name="hammer" size={26} color="#393c78" />
      </Animated.View>

      <Animated.View
        style={[
          styles.floatingIcon,
          styles.floatingIcon2,
          {
            opacity: floatingIcon2,
            transform: [
              {translateY: getFloatingTransform(floatingIcon2)},
              {rotate: getFloatingRotate(floatingIcon2)},
            ],
          },
        ]}>
        <MaterialCommunityIcons name="broom" size={30} color="#5fb9de" />
      </Animated.View>

      <Animated.View
        style={[
          styles.floatingIcon,
          styles.floatingIcon3,
          {
            opacity: floatingIcon3,
            transform: [
              {translateY: getFloatingTransform(floatingIcon3)},
              {rotate: getFloatingRotate(floatingIcon3)},
            ],
          },
        ]}>
        <Icon name="construct" size={28} color="#abc454" />
      </Animated.View>

      <Animated.View
        style={[
          styles.floatingIcon,
          styles.floatingIcon4,
          {
            opacity: floatingIcon4,
            transform: [
              {translateY: getFloatingTransform(floatingIcon4)},
              {rotate: getFloatingRotate(floatingIcon4)},
            ],
          },
        ]}>
        <MaterialCommunityIcons name="wrench" size={26} color="#393c78" />
      </Animated.View>

      <Animated.View
        style={[
          styles.floatingIcon,
          styles.floatingIcon5,
          {
            opacity: floatingIcon5,
            transform: [
              {translateY: getFloatingTransform(floatingIcon5)},
              {rotate: getFloatingRotate(floatingIcon5)},
            ],
          },
        ]}>
        <Icon name="water" size={24} color="#5fb9de" />
      </Animated.View>

      <Animated.View
        style={[
          styles.floatingIcon,
          styles.floatingIcon6,
          {
            opacity: floatingIcon6,
            transform: [
              {translateY: getFloatingTransform(floatingIcon6)},
              {rotate: getFloatingRotate(floatingIcon6)},
            ],
          },
        ]}>
        <MaterialCommunityIcons name="lightbulb-on" size={28} color="#abc454" />
      </Animated.View>

      {/* Enhanced Sparkles with rotation */}
      <Animated.View
        style={[
          styles.sparkle,
          styles.sparkle1,
          {
            opacity: getSparkleOpacity(sparkle1),
            transform: [
              {scale: getSparkleScale(sparkle1)},
              {rotate: getSparkleRotate(sparkle1)},
            ],
          },
        ]}>
        <Icon name="star" size={18} color="#abc454" />
      </Animated.View>

      <Animated.View
        style={[
          styles.sparkle,
          styles.sparkle2,
          {
            opacity: getSparkleOpacity(sparkle2),
            transform: [
              {scale: getSparkleScale(sparkle2)},
              {rotate: getSparkleRotate(sparkle2)},
            ],
          },
        ]}>
        <Icon name="star" size={14} color="#5fb9de" />
      </Animated.View>

      <Animated.View
        style={[
          styles.sparkle,
          styles.sparkle3,
          {
            opacity: getSparkleOpacity(sparkle3),
            transform: [
              {scale: getSparkleScale(sparkle3)},
              {rotate: getSparkleRotate(sparkle3)},
            ],
          },
        ]}>
        <Icon name="star" size={16} color="#393c78" />
      </Animated.View>

      <Animated.View
        style={[
          styles.sparkle,
          styles.sparkle4,
          {
            opacity: getSparkleOpacity(sparkle4),
            transform: [
              {scale: getSparkleScale(sparkle4)},
              {rotate: getSparkleRotate(sparkle4)},
            ],
          },
        ]}>
        <Icon name="star" size={12} color="#abc454" />
      </Animated.View>

      <Animated.View
        style={[
          styles.sparkle,
          styles.sparkle5,
          {
            opacity: getSparkleOpacity(sparkle5),
            transform: [
              {scale: getSparkleScale(sparkle5)},
              {rotate: getSparkleRotate(sparkle5)},
            ],
          },
        ]}>
        <Icon name="star" size={10} color="#5fb9de" />
      </Animated.View>

      <Animated.View
        style={[
          styles.sparkle,
          styles.sparkle6,
          {
            opacity: getSparkleOpacity(sparkle6),
            transform: [
              {scale: getSparkleScale(sparkle6)},
              {rotate: getSparkleRotate(sparkle6)},
            ],
          },
        ]}>
        <Icon name="star" size={14} color="#393c78" />
      </Animated.View>

      {/* Main Content Container */}
      <View style={styles.contentContainer}>
        {/* Logo with enhanced animations */}
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: logoOpacity,
              transform: [
                {scale: logoScale},
                {translateY: logoBounceTranslate},
                {rotate: logoRotateInterpolate},
              ],
            },
          ]}>
          {/* Pulsing glow effect */}
          <Animated.View
            style={[
              styles.logoGlow,
              {
                transform: [{scale: pulseAnim}],
              },
            ]}
          />
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/logo.jpg')}
              style={styles.logoImage}
              resizeMode="cover"
            />
          </View>
        </Animated.View>

        {/* Brand Name with scale animation */}
        <Animated.View
          style={[
            styles.titleContainer,
            {
              opacity: titleOpacity,
              transform: [{scale: titleScale}],
            },
          ]}>
          <Text style={styles.brandName}>Paaso</Text>
          <View style={styles.titleUnderline} />
        </Animated.View>

        {/* Tagline/Subtitle */}
        <Animated.View
          style={[
            styles.subtitleContainer,
            {
              opacity: subtitleOpacity,
              transform: [{translateY: subtitleTranslateY}],
            },
          ]}>
          <View style={styles.subtitleWrapper}>
            <View style={styles.subtitleDot} />
            <Text style={styles.subtitle}>Your Home Service Customer</Text>
            <View style={styles.subtitleDot} />
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  // Decorative shapes - Enhanced wavy curved shapes
  topLeftShape: {
    position: 'absolute',
    top: -80,
    left: -180,
    width: 400,
    height: 450,
    borderRadius: 200,
    overflow: 'hidden',
    transform: [{scaleX: 1.6}, {rotate: '-15deg'}],
  },
  shapeGradient1: {
    width: '100%',
    height: '100%',
    backgroundColor: '#5fb9de', // Color 2
    opacity: 0.25,
  },
  topRightShape: {
    position: 'absolute',
    top: 60,
    right: -120,
    width: 280,
    height: 280,
    borderRadius: 140,
    overflow: 'hidden',
    transform: [{rotate: '20deg'}],
  },
  shapeGradient2: {
    width: '100%',
    height: '100%',
    backgroundColor: '#abc454', // Color 3
    opacity: 0.35,
  },
  bottomLeftShape: {
    position: 'absolute',
    bottom: -250,
    left: -220,
    width: 550,
    height: 650,
    borderRadius: 275,
    overflow: 'hidden',
    transform: [{scaleX: 1.4}, {rotate: '25deg'}],
  },
  shapeGradient3: {
    width: '100%',
    height: '100%',
    backgroundColor: '#393c78', // Color 1
    opacity: 0.45,
  },
  bottomRightShape: {
    position: 'absolute',
    bottom: 30,
    right: -180,
    width: 450,
    height: 550,
    borderRadius: 225,
    overflow: 'hidden',
    transform: [{scaleX: 1.5}, {rotate: '-20deg'}],
  },
  shapeGradient4: {
    width: '100%',
    height: '100%',
    backgroundColor: '#5fb9de', // Color 2
    opacity: 0.4,
  },
  // Floating icons - Enhanced
  floatingIcon: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(95, 185, 222, 0.1)',
  },
  floatingIcon1: {
    top: 110,
    left: 35,
  },
  floatingIcon2: {
    top: 170,
    right: 45,
  },
  floatingIcon3: {
    top: height * 0.38,
    right: 25,
  },
  floatingIcon4: {
    bottom: 240,
    left: 45,
  },
  floatingIcon5: {
    bottom: 170,
    right: 55,
  },
  floatingIcon6: {
    bottom: 310,
    right: 35,
  },
  // Sparkles - Enhanced
  sparkle: {
    position: 'absolute',
  },
  sparkle1: {
    top: 90,
    left: 55,
  },
  sparkle2: {
    top: 140,
    right: 75,
  },
  sparkle3: {
    bottom: 190,
    left: 65,
  },
  sparkle4: {
    bottom: 270,
    right: 85,
  },
  sparkle5: {
    top: height * 0.3,
    left: 40,
  },
  sparkle6: {
    bottom: height * 0.35,
    right: 50,
  },
  // Main content
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    zIndex: 10,
  },
  // Logo styles - Enhanced
  logoWrapper: {
    marginBottom: spacing.xl * 2,
    position: 'relative',
  },
  logoGlow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#5fb9de',
    opacity: 0.15,
    top: -20,
    left: -20,
  },
  logoContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5fb9de',
    shadowOffset: {width: 0, height: 20},
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 25,
    borderWidth: 8,
    borderColor: colors.background,
    overflow: 'hidden',
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 92,
  },
  // Title styles - Enhanced
  titleContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  brandName: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#393c78',
    letterSpacing: 3,
    textShadowColor: 'rgba(95, 185, 222, 0.3)',
    textShadowOffset: {width: 0, height: 4},
    textShadowRadius: 8,
  },
  titleUnderline: {
    width: 80,
    height: 4,
    backgroundColor: '#5fb9de',
    borderRadius: 2,
    marginTop: spacing.sm,
  },
  // Subtitle styles - Enhanced
  subtitleContainer: {
    alignItems: 'center',
  },
  subtitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(95, 185, 222, 0.08)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  subtitleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#abc454',
    marginHorizontal: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
});
