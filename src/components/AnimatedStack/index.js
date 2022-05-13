import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import Like from '../../../assets/images/LIKE.png';
import Nope from '../../../assets/images/nope.png';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useAnimatedGestureHandler,
  interpolate,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

const ROTATION = 60;
const SWIPE_VELOCITY = 800;

const AnimatedStack = props => {
  const {data, renderItem, onSwipeLeft, onUpdate} = props;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(currentIndex + 1);
  const currentProfile = data[currentIndex];
  const nextProfile = data[nextIndex];

  // {width: screenWidth} means width value is now assigned to screenWidth variable
  const {width: screenWidth} = useWindowDimensions();

  const translateX = useSharedValue(0);

  const hiddenTranslateX = 2 * screenWidth;

  const rotate = useDerivedValue(
    () =>
      interpolate(translateX.value, [0, hiddenTranslateX], [0, ROTATION]) +
      'deg',
  );

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },

      {
        rotate: rotate.value,
      },
    ],
  }));

  const nextCardStyle = useAnimatedStyle(() => ({
    tranform: [
      {
        scale: interpolate(
          translateX.value,
          [-hiddenTranslateX, 0, hiddenTranslateX],
          [1, 0.5, 1],
        ),
      },
    ],
    opacity: interpolate(
      translateX.value,
      [-hiddenTranslateX, 0, hiddenTranslateX],
      [1, 0.3, 1],
    ),
  }));

  const likeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, 60], [0, 1]),
  }));

  const nopeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, -60], [0, 1]),
  }));

  // Need to remember the starting position of the card or else the card wil jump
  // You need to know the initial value hence u use context
  // context is like a state that is shared between the handlers

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
    },
    onEnd: event => {
      if (Math.abs(event.velocityX) < SWIPE_VELOCITY) {
        translateX.value = withSpring(0);
        return;
      }
      translateX.value = withSpring(
        hiddenTranslateX * Math.sign(event.velocityX),
        {},
        () => runOnJS(setCurrentIndex)(currentIndex + 1),
      );
      // runOnJS(setCurrentIndex)(currentIndex + 1);
      // runOnJS(setNextIndex)(currentIndex + 2);
      // translateX.value = withSpring(0);
    },
  });

  useEffect(() => {
    translateX.value = 0;
    setNextIndex(currentIndex + 1);
  }, [currentIndex, translateX]);

  // Alternative way for useAnimatedHandler is Gesture [LATEST VERSION]
  // const context = useSharedValue(0);

  // const gesture = Gesture.Pan()
  //   .onStart(() => {
  //     context.value = translateX.value;
  //   })
  //   .onUpdate(event => {
  //     translateX.value = context.value + event.translationX;
  //   });

  return (
    <View style={styles.root}>
      {nextProfile && (
        <View style={styles.nextCardContainer}>
          <Animated.View style={[styles.animatedCard, nextCardStyle]}>
            {renderItem({item: nextProfile})}
          </Animated.View>
        </View>
      )}
      {currentProfile && (
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.animatedCard, cardStyle]}>
            <Animated.Image
              source={Like}
              style={[styles.like, {left: 10}, likeStyle]}
              resizeMode="contain"
            />
            <Animated.Image
              source={Nope}
              style={[styles.like, {right: 10}, nopeStyle]}
              resizeMode="contain"
            />
            {renderItem({item: currentProfile})}
          </Animated.View>
        </PanGestureHandler>
      )}
    </View>
  );
};

// The reason transform does not work is that another tranform has already overriden up above

const styles = StyleSheet.create({
  root: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  animatedCard: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    height: '70%',
    // transform: [{skewX: '45deg'}],
  },
  nextCardContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  like: {
    width: 150,
    height: 150,
    position: 'absolute',
    top: 10,
    zIndex: 1,
    // elevation: 1,
  },
});

export default AnimatedStack;
