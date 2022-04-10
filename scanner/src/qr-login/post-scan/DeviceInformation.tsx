import {Dimensions} from 'react-native';
import React from 'react';
import {NavigationFunctionComponent, Navigation} from 'react-native-navigation';
import {
  Text,
  Box,
  Image,
  NativeBaseProvider,
  VStack,
  Button,
} from 'native-base';
import {Screens} from '../../utils/screens';
import Info from '../utils/Info';
import {Information} from '../../types/information';

const {width, height} = Dimensions.get('window');
const found = require('../../assets/found.png');

const paths: {[id: string]: Information} = {
  success: {
    image: require('../../assets/scan-success.png'),
    alt: 'Cat took over your phone',
    title: 'Cats took over your phone',
    info: "You've been logged into your device successfully",
  },
  notFound: {
    image: require('../../assets/not-found.png'),
    alt: 'Cat is looking at an empty bowl',
    title: "It's empty?",
    info: 'We could not log you into your device, you may have taken too long or there was not such device in first place',
  },
};

const DeviceInformation: NavigationFunctionComponent = ({componentId}) => {
  const toRoot = () => Navigation.popToRoot(Screens.STACK);

  const toSuccess = () =>
    Navigation.push(componentId, {
      component: {
        name: Screens.POST_SCAN,
        passProps: {
          information: paths.notFound,
        },
      },
    });

  return (
    <NativeBaseProvider>
      <Box flex={1} py={'4'} bg={'#fff'} alignItems={'center'}>
        <Image
          source={found}
          width={width}
          height={height / 2}
          resizeMode={'contain'}
          alt={'Cat is looking at phone front camera'}
        />
        <VStack flex={1} justifyContent={'space-between'} alignItems={'center'}>
          <VStack>
            <Text
              fontSize={'24'}
              fontWeight={'bold'}
              color={'#1d1d1d'}
              mb={'2'}
              textAlign={'center'}>
              Your device
            </Text>
            <Info text={'Linux, Firefox 99.3'} />
            <Info text={'IP address 192.168.0.1'} />
            <Info text={'Manizales, Caldas'} />
          </VStack>
          <VStack>
            <Button
              bgColor={'#1d1d1d'}
              textTransform={'uppercase'}
              mb={'2'}
              onPress={toSuccess}>
              Log me in
            </Button>
            <Button
              variant={'outline'}
              bgColor={'#fff'}
              borderColor={'#1d1d1d'}
              color={'#1d1d1d'}
              textTransform={'uppercase'}
              onPress={toRoot}>
              <Info text={'This is not my device'} />
            </Button>
          </VStack>
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
};

DeviceInformation.options = {
  statusBar: {
    visible: false,
  },
  hardwareBackButton: {
    popStackOnPress: false,
  },
};

export default DeviceInformation;
