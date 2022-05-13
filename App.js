import 'react-native-gesture-handler';
import React from 'react';
import {View, StyleSheet} from 'react-native';
import users from './assets/data/users';
// import AnimatedStack from '.src/components/AnimatedStack';
import Card from './src/components/TinderCard/index';
import AnimatedStack from './src/components/AnimatedStack/index';

const App = () => {
  const onSwipeLeft = user => {
    console.log('swipe left', user.name);
  };

  const onSwipeRight = user => {
    console.log('swipe right', user.name);
  };

  return (
    <AnimatedStack
      data={users}
      renderItem={({item}) => (
        <Card
          user={item}
          onSwipeLeft={onSwipeLeft}
          onSwipeRight={onSwipeRight}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

export default App;
