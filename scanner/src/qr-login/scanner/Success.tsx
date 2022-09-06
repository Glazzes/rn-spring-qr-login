import {View, Dimensions, StyleSheet} from 'react-native';
import React, {useEffect, useRef} from 'react';
import AnimatedLottieView from 'lottie-react-native';
import emitter from '../../utils/emitter';

const {width, height} = Dimensions.get('window');
const SIZE = width * 0.8;

type SuccessProps = {};

const Success: React.FC<SuccessProps> = () => {
  const lottie = useRef<AnimatedLottieView>(null);

  const toHome = () => {};

  useEffect(() => {
    emitter.addListener('play.animation', (_: {}) => {
      lottie.current?.play(0, 90);
    });

    return () => {
      emitter.removeCurrentListener();
    };
  }, []);

  return (
    <View style={styles.root}>
      <AnimatedLottieView
        ref={lottie}
        source={require('../../assets/qr-scan.json')}
        style={styles.animation}
        onAnimationFinish={toHome}
        loop={false}
      />
    </View>
  );
};

export default Success;

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: SIZE,
    height: SIZE,
  },
});
