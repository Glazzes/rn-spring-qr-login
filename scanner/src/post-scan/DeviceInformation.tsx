import {Dimensions, Alert} from 'react-native';
import React from 'react';
import {Text, Box, Image, VStack, Button} from 'native-base';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {Information} from '../utils/types';
import {StackScreens} from '../navigation/stackScreens';
import {qrCancelLoginEventUrl, qrLoginPerformEventUrl} from '../utils/urls';
import Info from './Info';
import {axiosInstance} from '../utils/axiosInstance';
import {AxiosError} from 'axios';

const {width, height} = Dimensions.get('window');
const found = require('../assets/found.png');

const paths: {[id: string]: Information} = {
  success: {
    image: require('../assets/scan-success.png'),
    alt: 'Cat took over your phone',
    title: 'Cats took over your phone',
    info: "You've been logged into your device successfully",
  },
  notFound: {
    image: require('../assets/not-found.png'),
    alt: 'Cat is looking at an empty bowl',
    title: "It's empty?",
    info: 'We could not log you into your device, you may have taken too long or there was not such device in first place',
  },
};

type DeviceInformationProps = {
  navigation: NavigationProp<StackScreens, 'DeviceInformation'>;
  route: RouteProp<StackScreens, 'DeviceInformation'>;
};

const DeviceInformation: React.FC<DeviceInformationProps> = ({
  navigation,
  route,
}) => {
  const login = async () => {
    try {
      const url = qrLoginPerformEventUrl(route.params.id);
      await axiosInstance.post(url, undefined);

      navigation.navigate('ScanResult', {
        information: paths.success,
      });
    } catch (e) {
      const response = (e as AxiosError).response;
      if (response?.status === 404) {
        navigation.navigate('ScanResult', {
          information: paths.notFound,
        });

        return;
      }

      if (response?.status !== 404) {
        Alert.alert('There was a problem while logging in');
      }
    }
  };

  const cancelLogin = async () => {
    try {
      const url = qrCancelLoginEventUrl(route.params.id);
      await axiosInstance.post(url, undefined);

      navigation.navigate('Home');
    } catch (e) {
      const response = (e as AxiosError).response;
      if (response?.status === 404) {
        navigation.navigate('Home');
      }

      if (response?.status !== 500) {
        Alert.alert('Error sending signal to your device');
      }
    }
  };

  return (
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
          <Info text={route.params.device} />
          <Info text={`Ip address ${route.params.ipAddress}`} />
          <Info text={route.params.location} />
        </VStack>
        <VStack>
          <Button
            bgColor={'#1d1d1d'}
            textTransform={'uppercase'}
            mb={'2'}
            onPress={login}>
            Log me in
          </Button>
          <Button
            variant={'outline'}
            bgColor={'#fff'}
            borderColor={'#1d1d1d'}
            color={'#1d1d1d'}
            textTransform={'uppercase'}
            onPress={cancelLogin}>
            <Info text={'This is not my device'} />
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
};

export default DeviceInformation;
