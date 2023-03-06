import React from 'react';
import {Center, View} from 'native-base';
import Appbar from './Appbar';
import {Dimensions, StatusBar, StyleSheet} from 'react-native';
import {NavigationProp} from '@react-navigation/native';
import {StackScreens} from '../navigation/stackScreens';
import Button from '../utils/components/Button';
import {mmkv} from '../utils/mmkv';
import {useDispatch} from 'react-redux';
import {setIsAuthenticated} from '../store/slices/authSlice';

const {width} = Dimensions.get('window');

type HomeProps = {
  navigation: NavigationProp<StackScreens, 'Home'>;
};

const Home: React.FC<HomeProps> = ({navigation}) => {
  const dispatch = useDispatch();

  const toWarning = async () => {
    navigation.navigate('Warning');
  };

  const logout = async () => {
    mmkv.delete('tokens');
    dispatch(setIsAuthenticated(true));
  };

  return (
    <View style={styles.root}>
      <StatusBar
        backgroundColor={'rgba(0, 0, 0, 0.1)'}
        barStyle={'light-content'}
      />
      <Appbar />
      <Center flex={1}>
        <Button
          text={'Login with QR code'}
          onPress={toWarning}
          width={width * 0.5}
        />
        <Button text={'Logout'} onPress={logout} width={width * 0.5} />
      </Center>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default Home;
