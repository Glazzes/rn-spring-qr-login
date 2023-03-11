import React from 'react';
import {Center, View} from 'native-base';
import Appbar from './Appbar';
import {Dimensions, StatusBar, StyleSheet} from 'react-native';
import {NavigationProp} from '@react-navigation/native';
import Button from '../../utils/components/Button';
import {mmkv} from '../../utils/mmkv';
import {useDispatch} from 'react-redux';
import {setIsAuthenticated} from '../../store/slices/authSlice';
import {StackScreens} from '../../utils/types';

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
    dispatch(setIsAuthenticated(false));
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
          action={'accept'}
          extraStyle={styles.margin}
        />
        <Button
          text={'Logout'}
          onPress={logout}
          width={width * 0.5}
          action={'decline'}
        />
      </Center>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  margin: {
    marginBottom: 16,
  },
});

export default Home;
