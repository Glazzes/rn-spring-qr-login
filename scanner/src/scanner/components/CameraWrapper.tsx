import {View, StyleSheet, useWindowDimensions} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import React from 'react';

type CameraWrapperProps = {
  children: React.ReactNode;
};

const CameraWrapper: React.FC<CameraWrapperProps> = ({children}) => {
  const {width, height} = useWindowDimensions();
  const isPortrait = height > width;

  const centerX = width / 2;
  const centerY = height / 2;
  const radius = ((isPortrait ? width : height) * 0.8) / 2;
  const length = 45;
  const arcRadius = 8;

  const getPoint = (angle: number) => {
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + -(radius * Math.sin(angle)),
    };
  };

  const overlay = [
    'M 0 0',
    `h ${width}`,
    `v ${height}`,
    `h ${-width}`,
    `v ${-height}`,
    `M ${centerX - radius} ${centerY}`,
    `a ${radius} ${radius} 0 0 0 ${radius * 2} 0`,
    `a ${radius} ${radius} 0 0 0 ${-radius * 2} 0`,
  ].join(' ');

  const topRight = getPoint(Math.PI / 4);
  const topRightPath = [
    `M ${topRight.x - length} ${topRight.y}`,
    `h ${length - arcRadius}`,
    `a ${arcRadius} ${arcRadius} 0 0 1 ${arcRadius} ${arcRadius}`,
    `v ${length - arcRadius}`,
  ].join(' ');

  const topLeft = getPoint((3 / 4) * Math.PI);
  const topLeftPath = [
    `M ${topLeft.x + length} ${topLeft.y}`,
    `h ${-length + arcRadius}`,
    `a ${arcRadius} ${arcRadius} 0 0 0 ${-arcRadius} ${arcRadius}`,
    `v ${length - arcRadius}`,
  ].join(' ');

  const bottomLeft = getPoint((5 / 8) * (Math.PI * 2));
  const bottomLeftPath = [
    `M ${bottomLeft.x} ${bottomLeft.y - length}`,
    `v ${length - arcRadius}`,
    `a ${arcRadius} ${arcRadius} 0 0 0 ${arcRadius} ${arcRadius}`,
    `h ${length - arcRadius}`,
  ].join(' ');

  const bottomRight = getPoint((7 / 8) * (Math.PI * 2));
  const bottomRightPath = [
    `M ${bottomRight.x} ${bottomRight.y - length}`,
    `v ${length - arcRadius}`,
    `a ${arcRadius} ${arcRadius} 0 0 1 ${-arcRadius} ${arcRadius}`,
    `h ${-length - arcRadius}`,
  ].join(' ');

  return (
    <View style={styles.root}>
      {children}
      <Svg width={width} height={height} style={StyleSheet.absoluteFillObject}>
        <Path d={overlay} fill={'rgba(0, 0, 0, 0.6)'} />
        <Path d={topLeftPath} stroke={'#fff'} strokeWidth={1} />
        <Path d={topRightPath} stroke={'#fff'} strokeWidth={1} />
        <Path d={bottomLeftPath} stroke={'#fff'} strokeWidth={1} />
        <Path d={bottomRightPath} stroke={'#fff'} strokeWidth={1} />
      </Svg>
    </View>
  );
};

export default CameraWrapper;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
