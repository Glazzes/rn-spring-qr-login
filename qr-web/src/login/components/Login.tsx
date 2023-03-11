import {View, StyleSheet, useWindowDimensions} from 'react-native';
import React from 'react';
import {SIZE} from '../../utils/contants';
import EmailPasswordLogin from './EmailPasswordLogin';
import QrCodeLogin from './QrCodeLogin';

const Login: React.FC = () => {
  const {width, height} = useWindowDimensions();
  const isPortait = height > width;

  return (
    <View style={isPortait ? styles.rootPortrait : styles.rootLandscape}>
      <EmailPasswordLogin />
      <View style={isPortait ? styles.dividerPortrait : styles.dividerLandscape} />
      <QrCodeLogin />
    </View>
  );
};

const styles = StyleSheet.create({
  rootPortrait: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rootLandscape: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  dividerLandscape: {
    width: 2,
    height: SIZE,
    backgroundColor: '#2C3639',
    marginHorizontal: 32,
  },
  dividerPortrait: {
    width: SIZE,
    height: 2,
    backgroundColor: '#2C3639',
    marginVertical: 32,
  }
});

export default Login;
