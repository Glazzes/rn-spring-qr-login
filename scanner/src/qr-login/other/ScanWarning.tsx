import {Dimensions} from 'react-native';
import React from 'react';
import {Box, Image, VStack, Text, Button} from 'native-base';
import {StackScreens} from '../../navigation/stackScreens';
import {NavigationProp} from '@react-navigation/native';

const {width} = Dimensions.get('window');
const SIZE = width * 0.9;
const gateway = require('../../assets/gateway.png');

type ScanWarningProps = {
  navigation: NavigationProp<StackScreens, 'Warning'>;
};

const ScanWarning: React.FC<ScanWarningProps> = ({navigation}) => {
  const toScanner = () => {
    navigation.navigate('Scanner');
  };

  return (
    <Box flex={1} py={'4'} bg={'#fff'} alignItems={'center'}>
      <Image
        source={gateway}
        width={SIZE}
        height={SIZE}
        resizeMode={'contain'}
        alt={'Cat guides you to another dimension'}
      />
      <VStack flex={1} alignItems={'center'} justifyContent={'space-between'}>
        <Box px={'4'}>
          <Text
            fontSize={'24'}
            fontWeight={'bold'}
            color={'#1d1d1d'}
            mb={'2'}
            textAlign={'center'}>
            Before you go!
          </Text>
          <Text
            textAlign={'center'}
            color={'#4e4e4e'}
            fontSize={'14'}
            fontWeight={'semibold'}>
            Only scan QR codes on your devices, Do not scan codes sent by other
            people or your account may be in danger
          </Text>
        </Box>
        <Button bgColor={'#1d1d1d'} onPress={toScanner}>
          Scan QR code
        </Button>
      </VStack>
    </Box>
  );
};

export default ScanWarning;
