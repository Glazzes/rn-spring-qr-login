import {View, StyleSheet, Dimensions} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import React from 'react';

const {width, height} = Dimensions.get('window');
const cx = width / 2;
const cy = height / 2;
const R = (width * 0.8) / 2;
const length = 45;
const arcRadius = 8;

const getPoint = (angle: number) => {
  return {
    x: cx + R * Math.cos(angle),
    y: cy + -(R * Math.sin(angle)),
  };
};

const overlay = [
  'M 0 0',
  `h ${width}`,
  `v ${height}`,
  `h ${-width}`,
  `v ${-height}`,
  `M ${cx - R} ${cy}`,
  `a ${R} ${R} 0 0 0 ${R * 2} 0`,
  `a ${R} ${R} 0 0 0 ${-R * 2} 0`,
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

const blPoint = getPoint((5 / 8) * (Math.PI * 2));
const blPath = [
  `M ${blPoint.x} ${blPoint.y - length}`,
  `v ${length - arcRadius}`,
  `a ${arcRadius} ${arcRadius} 0 0 0 ${arcRadius} ${arcRadius}`,
  `h ${length - arcRadius}`,
].join(' ');

const brPoint = getPoint((7 / 8) * (Math.PI * 2));
const brPath = [
  `M ${brPoint.x} ${brPoint.y - length}`,
  `v ${length - arcRadius}`,
  `a ${arcRadius} ${arcRadius} 0 0 1 ${-arcRadius} ${arcRadius}`,
  `h ${-length - arcRadius}`,
].join(' ');

type CameraWrapperProps = {
  children: React.ReactNode;
};

const CameraWrapper: React.FC<CameraWrapperProps> = ({children}) => {
  return (
    <View style={styles.root}>
      {children}
      <Svg width={width} height={height} style={StyleSheet.absoluteFillObject}>
        <Path d={overlay} fill={'rgba(0, 0, 0, 0.6)'} />
        <Path d={topLeftPath} stroke={'#fff'} strokeWidth={1} />
        <Path d={topRightPath} stroke={'#fff'} strokeWidth={1} />
        <Path d={blPath} stroke={'#fff'} strokeWidth={1} />
        <Path d={brPath} stroke={'#fff'} strokeWidth={1} />
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
