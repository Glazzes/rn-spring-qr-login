import {View, StyleSheet} from 'react-native';
import React from 'react';
import {SIZE} from '../../utils/contants';
import EmailPasswordLogin from './EmailPasswordLogin';
import QrCodeLogin from './QrCodeLogin';

const Login: React.FC = () => {
  return (
    <View style={styles.root}>
      <EmailPasswordLogin />
      <View style={styles.divider} />
      <QrCodeLogin />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  divider: {
    width: 2,
    height: SIZE - 10,
    backgroundColor: '#2C3639',
    marginHorizontal: 32,
  },
});

export default Login;
