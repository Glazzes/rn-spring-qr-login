import Animated from 'react-native-reanimated';
import {Vector} from './types';

export const clamp = (value: number, min: number, max: number): number => {
  'worklet';
  return Math.max(min, Math.min(value, max));
};

export const snapPoint = (
  value: number,
  velocity: number,
  points: ReadonlyArray<number>,
): number => {
  'worklet';
  const point = value + 0.2 * velocity;
  const deltas = points.map(p => Math.abs(point - p));
  const minDelta = Math.min.apply(null, deltas);
  return points.filter(p => Math.abs(point - p) === minDelta)[0];
};

export const set = (
  vector: Vector<Animated.SharedValue<number>>,
  value: number,
): void => {
  'worklet';
  vector.x.value = value;
  vector.y.value = value;
};
