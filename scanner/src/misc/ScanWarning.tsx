import {Dimensions} from 'react-native';
import React from 'react';
import {Box, Image, VStack, Text} from 'native-base';
import {NavigationProp} from '@react-navigation/native';
import Button from '../utils/components/Button';
import {StackScreens} from '../utils/types';

const {width} = Dimensions.get('window');
const SIZE = width * 0.8;

type ScanWarningProps = {
  navigation: NavigationProp<StackScreens, 'Warning'>;
};

const ScanWarning: React.FC<ScanWarningProps> = ({navigation}) => {
  const toScanner = () => {
    navigation.navigate('Scanner');
  };

  return (
    <Box
      flex={1}
      py={'4'}
      bg={'#fff'}
      justifyContent={'center'}
      alignItems={'center'}>
      <Image
        source={require('../assets/gateway.png')}
        width={SIZE}
        height={SIZE}
        resizeMode={'contain'}
        alt={'Cat guides you to another dimension'}
      />
      <VStack alignItems={'center'}>
        <Box px={'4'}>
          <Text
            fontSize={'22'}
            fontFamily={'UberBold'}
            color={'#1d1d1d'}
            mb={'2'}
            textAlign={'center'}>
            Before you go!
          </Text>
          <Text
            mb={4}
            textAlign={'center'}
            color={'#4e4e4e'}
            fontSize={'14'}
            fontWeight={'semibold'}>
            Only scan QR codes on your devices, Do not scan codes sent by other
            people or your account may be in danger
          </Text>
        </Box>
        <Button
          text={'SCAN A CODE'}
          width={width * 0.5}
          onPress={toScanner}
          action={'accept'}
        />
      </VStack>
    </Box>
  );
};

export default ScanWarning;
