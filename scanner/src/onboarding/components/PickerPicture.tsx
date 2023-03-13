import {StyleSheet, Dimensions, View, Pressable, Image} from 'react-native';
import React from 'react';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {Asset} from 'expo-media-library';
import Icon from '@expo/vector-icons/Ionicons';
import {SharedElement} from 'react-navigation-shared-element';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {StackScreens} from '../../utils/types';

type PickerPictureProps = {
  asset: Asset;
  index: number;
};

const {width} = Dimensions.get('window');

const PADDING = 5;
const SIZE = width / 3 - PADDING * 2;
const ICON_SIZE = 35;

const PickerPicture: React.FC<PickerPictureProps> = ({asset, index}) => {
  const navigation =
    useNavigation<NavigationProp<StackScreens, 'CreateAccount'>>();

  const devices = useCameraDevices();

  const onSelectedPicture = async () => {
    if (index === 0) {
      // emitter.emit('push.camera');
      return;
    }

    navigation.navigate('CropEditor', {
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
    });
  };

  return (
    <Pressable onPress={onSelectedPicture} style={styles.tile}>
      {index === 0 ? (
        <View style={styles.image}>
          {devices.front == null ? null : (
            <Camera
              isActive={true}
              device={devices.front}
              style={styles.image}
            />
          )}
          <Icon
            name={'camera'}
            size={ICON_SIZE}
            color={'#fff'}
            style={styles.icon}
          />
        </View>
      ) : (
        <SharedElement id={`image-${asset.uri}`} style={styles.image}>
          <Image
            source={{uri: asset.uri}}
            style={styles.image}
            resizeMode={'cover'}
          />
        </SharedElement>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  tile: {
    width: SIZE,
    height: SIZE,
    margin: PADDING,
    borderRadius: PADDING,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
  },
  icon: {
    position: 'absolute',
    top: SIZE / 2 - ICON_SIZE / 2,
    left: SIZE / 2 - ICON_SIZE / 2,
  },
});

export default React.memo(PickerPicture);
