import React from 'react';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {Button, Center, NativeBaseProvider, View} from 'native-base';
import Appbar from './Appbar';
import {StyleSheet} from 'react-native';
import useAddComponentId from '../hooks/useAddComponent';
import {Screens} from '../utils/screens';

const Home: NavigationFunctionComponent = ({componentId}) => {
  useAddComponentId(Screens.HOME, componentId);

  const toWarning = () => {
    Navigation.push(componentId, {
      component: {name: 'Warning'},
    });
  };

  return (
    <NativeBaseProvider>
      <View style={styles.root}>
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
    </NativeBaseProvider>
  );
};

export default Home;

Home.options = {
  statusBar: {
    backgroundColor: '#fff',
  },
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
