import {View, StyleSheet, Dimensions, Text, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Constants from 'expo-constants';
import {NotificationType} from '../utils/types';

type ToastInfo = {
  backgroundColor: string;
  progressColor: string;
  icon: string;
  status: string;
};

type Color = {
  [id: string]: ToastInfo;
};

type ToastProps = {
  title: string;
  message: string;
  type: NotificationType;
  onAnimationEnd?: () => void;
};

const {width} = Dimensions.get('window');

const information: Color = {
  success: {
    backgroundColor: '#07c468',
    progressColor: '#A2ECC4',
    icon: 'check-circle',
    status: 'Success!',
  },
  info: {
    backgroundColor: '#0087D7',
    progressColor: '#81C3EB',
    icon: 'information',
    status: 'Info!',
  },
  warning: {
    backgroundColor: '#FFBC00',
    progressColor: '#FFDE81',
    icon: 'information',
    status: 'Warning!',
  },
  error: {
    backgroundColor: '#F94415',
    progressColor: '#FCA48E',
    icon: 'plus-circle',
    status: 'Error!',
  },
};

const TOAST_WIDTH = width * 0.9;
const DURATION = 10000;

const Toast: React.FC<ToastProps> = ({
  type,
  message,
  title,
  onAnimationEnd,
}) => {
  const toastInfo = information[type];

  const translateX = useSharedValue<number>(0);
  const translateY = useSharedValue<number>(0);
  const [height, setHeight] = useState<number>(0);

  const containerStyles = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
  }));

  const rStyle = useAnimatedStyle(() => ({
    backgroundColor: toastInfo.progressColor,
    transform: [{translateX: translateX.value}],
  }));

  const hide = () => {
    translateY.value = withTiming(
      -(height + Constants.statusBarHeight),
      undefined,
      f => {
        if (f && onAnimationEnd) {
          runOnJS(onAnimationEnd)();
        }
      },
    );
  };

  useEffect(() => {
    if (height !== 0) {
      translateX.value = withTiming(
        -TOAST_WIDTH,
        {duration: DURATION, easing: Easing.linear},
        f => {
          if (f) {
            runOnJS(hide)();
          }
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height]);

  return (
    <Animated.View
      onLayout={e => setHeight(e.nativeEvent.layout.height)}
      style={[
        containerStyles,
        styles.toast,
        {backgroundColor: toastInfo.backgroundColor},
      ]}>
      <View style={styles.content}>
        <Icon
          // @ts-ignore
          name={toastInfo.icon}
          size={30}
          color={'#fff'}
          style={[
            styles.icon,
            {
              transform: [{rotate: type === 'error' ? '45deg' : '0deg'}],
            },
          ]}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.textContent}>{message}</Text>
        </View>
        <Pressable style={styles.closeIcon} onPress={hide}>
          <Icon name={'plus'} color={'#fff'} size={25} />
        </Pressable>
      </View>
      <Animated.View style={[styles.progress, rStyle]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    width: TOAST_WIDTH,
    position: 'absolute',
    overflow: 'hidden',
    top: Constants.statusBarHeight / 2,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
    elevation: 0.01,
  },
  icon: {
    alignSelf: 'center',
    margin: 5,
  },
  content: {
    flexDirection: 'row',
    padding: 5,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-around',
  },
  title: {
    color: '#fff',
    fontFamily: 'UberBold',
    fontSize: 15,
  },
  textContent: {
    color: '#fff',
    fontFamily: 'Uber',
  },
  closeIcon: {
    alignSelf: 'flex-start',
    transform: [{rotate: '45deg'}],
    marginLeft: 5,
  },
  progress: {
    height: 5,
    width: '100%',
  },
});

export default Toast;
