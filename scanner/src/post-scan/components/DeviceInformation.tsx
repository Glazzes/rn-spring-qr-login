import {Dimensions, Alert, StyleSheet} from 'react-native';
import React from 'react';
import {Text, Box, Image, VStack, StatusBar} from 'native-base';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {Information, StackScreens} from '../../utils/types';
import {qrCancelLoginEventUrl, qrLoginPerformEventUrl} from '../../utils/urls';
import Info from './Info';
import {axiosInstance} from '../../utils/axiosInstance';
import {AxiosError} from 'axios';
import Button from '../../utils/components/Button';
import withBlockedReturn from '../../utils/hoc/withBlockedReturn';

const {width} = Dimensions.get('window');
const found = require('../../assets/found.png');

const paths: {[id: string]: Information} = {
  success: {
    image: require('../../assets/scan-success.png'),
    alt: 'Trophy',
    title: 'You are logged in!',
    info: 'We have logged you into your other device successfully!',
  },
  notFound: {
    image: require('../../assets/not-found.png'),
    alt: 'Telescope on window, aimming at some planets',
    title: 'Missing device',
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
        console.log(response);
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
        navigation.navigate('ScanResult', {
          information: paths.notFound,
        });

        return;
      }

      if (response?.status === 500) {
        Alert.alert('Error sending signal to your device');
      }
    }
  };

  return (
    <Box
      flex={1}
      py={'4'}
      bg={'#fff'}
      justifyContent={'center'}
      alignItems={'center'}>
      <StatusBar backgroundColor={'#fff'} barStyle={'light-content'} />
      <Image
        source={found}
        width={width - 60}
        height={width - 60}
        resizeMode={'contain'}
        alt={'Phone, megaphone and a tablet'}
      />
      <VStack justifyContent={'center'} alignItems={'center'}>
        <VStack>
          <Text
            fontSize={'22'}
            fontWeight={'bold'}
            fontFamily={'UberBold'}
            color={'#1d1d1d'}
            mb={'2'}
            textAlign={'center'}>
            Is this your device?
          </Text>
          <Info text={route.params.device} />
          <Info text={`Ip address ${route.params.ipAddress}`} />
          <Info text={route.params.location} />
        </VStack>
        <VStack>
          <Button
            text={'Log me in'}
            width={width * 0.5}
            onPress={login}
            action={'accept'}
            extraStyle={styles.margin}
          />
          <Button
            text={'This is not my device'}
            width={width * 0.5}
            onPress={cancelLogin}
            action={'decline'}
          />
        </VStack>
      </VStack>
    </Box>
  );
};

const styles = StyleSheet.create({
  margin: {
    marginVertical: 16,
  },
});

export default withBlockedReturn(DeviceInformation);
