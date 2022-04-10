import {Dimensions} from 'react-native';
import React from 'react';
import {
  Box,
  Button,
  Image,
  NativeBaseProvider,
  Text,
  VStack,
} from 'native-base';
import {Navigation, NavigationFunctionComponent} from 'react-native-navigation';
import {Screens} from '../../utils/screens';
import {Information} from '../../types/information';
import useAddComponentId from '../../hooks/useAddComponent';

const {width, height} = Dimensions.get('window');

type PostScanInformationProps = {
  information: Information;
};

const PostScanInformation: NavigationFunctionComponent<
  PostScanInformationProps
> = ({information, componentId}) => {
  useAddComponentId(Screens.POST_SCAN, componentId);
  const toHome = () => Navigation.popToRoot(Screens.STACK);

  return (
    <NativeBaseProvider>
      <Box flex={1} py={'4'} bg={'#fff'} alignItems={'center'}>
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
              fontSize={'24'}
              fontWeight={'bold'}
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
            bgColor={'#1d1d1d'}
            textTransform={'uppercase'}
            onPress={toHome}>
            Take me home
          </Button>
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
};

PostScanInformation.options = {
  statusBar: {
    visible: false,
  },
  hardwareBackButton: {
    popStackOnPress: false,
  },
};

export default PostScanInformation;
