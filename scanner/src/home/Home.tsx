import React from 'react';
import {Button, Center, View} from 'native-base';
import Appbar from './Appbar';
import {StatusBar, StyleSheet} from 'react-native';
import {NavigationProp} from '@react-navigation/native';
import {StackScreens} from '../navigation/stackScreens';

type HomeProps = {
  navigation: NavigationProp<StackScreens, 'Home'>;
};

const Home: React.FC<HomeProps> = ({navigation}) => {
  const toWarning = () => {
    navigation.navigate('Warning');
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
          bgColor={'#1d1d1d'}
          rounded={'md'}
          fontWeight={'bold'}
          onPress={() => toWarning()}>
          Login with QR
        </Button>
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
