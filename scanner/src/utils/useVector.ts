import Animated, {useSharedValue} from 'react-native-reanimated';
import {Vector} from './types';

export const useVector = (
  x: number,
  y?: number,
): Vector<Animated.SharedValue<number>> => {
  const xValue = useSharedValue<number>(x);
  const yValue = useSharedValue<number>(y ?? x);

  return {
    x: xValue,
    y: yValue,
  };
};
