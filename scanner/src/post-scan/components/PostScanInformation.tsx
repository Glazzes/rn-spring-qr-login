import {Dimensions} from 'react-native';
import React from 'react';
import {Box, Image, StatusBar, Text, VStack} from 'native-base';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {StackScreens} from '../../utils/types';
import Button from '../../utils/components/Button';

const {width, height} = Dimensions.get('window');

type PostScanInformationProps = {
  navigation: NavigationProp<StackScreens, 'ScanResult'>;
  route: RouteProp<StackScreens, 'ScanResult'>;
};

const PostScanInformation: React.FC<PostScanInformationProps> = ({
  navigation,
  route,
}) => {
  const information = route.params.information;

  const toHome = () => {
    navigation.navigate('Home');
  };

  if (!information) {
    return null;
  }

  return (
    <Box flex={1} py={'4'} bg={'#fff'} alignItems={'center'}>
      <StatusBar backgroundColor={'rgba(0, 0, 0, 0.2)'} />
      <Image
        alt={information.alt}
        source={information.image}
        width={width}
        height={height / 2}
        resizeMode={'contain'}
      />
      <VStack flex={1} alignItems={'center'} justifyContent={'space-between'}>
        <Box px={'4'}>
          <Text
            fontSize={'22'}
            fontFamily={'UberBold'}
            color={'#1d1d1d'}
            mb={'2'}
            textAlign={'center'}>
            {information.title}
          </Text>
          <Text
            textAlign={'center'}
            color={'#4e4e4e'}
            fontSize={'14'}
            fontWeight={'semibold'}>
            {information.info}
          </Text>
        </Box>
        <Button
          text={'Take me home'}
          width={width * 0.5}
          onPress={toHome}
          action={'accept'}
        />
      </VStack>
    </Box>
  );
};

export default PostScanInformation;
