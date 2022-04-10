import {LogBox, StyleSheet, View} from 'react-native';
import React from 'react';
import CameraWrapper from './CameraWrapper';
import Camera from './Camera';
import {NavigationFunctionComponent} from 'react-native-navigation';
import Success from './Success';
import useAddComponentId from '../../hooks/useAddComponent';
import {Screens} from '../../utils/screens';

LogBox.ignoreLogs(['ViewPropTypes']);

const Scanner: NavigationFunctionComponent = ({componentId}) => {
  useAddComponentId(Screens.SCANNER, componentId);

  return (
    <View style={styles.root}>
      <CameraWrapper>
        <Camera />
        <Success parentId={componentId} />
      </CameraWrapper>
    </View>
  );
};

Scanner.options = {
  statusBar: {
    visible: false,
  },
  topBar: {
    visible: false,
  },
};

export default Scanner;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
