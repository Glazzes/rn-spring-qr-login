import {LogBox, StatusBar, StyleSheet, View} from 'react-native';
import React from 'react';
import CameraWrapper from './CameraWrapper';
import Camera from './Camera';

LogBox.ignoreLogs(['ViewPropTypes']);

const Scanner: React.FC = () => {
  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={'#000'} />
      <CameraWrapper>
        <Camera />
      </CameraWrapper>
    </View>
  );
};

export default Scanner;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
