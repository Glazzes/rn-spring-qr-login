import {
  Dimensions,
  StyleSheet,
  Alert,
  View,
  Text,
  FlatList,
  ListRenderItemInfo,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Animated, {
  cancelAnimation,
  scrollTo,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {
  Asset,
  getAlbumsAsync,
  getAssetsAsync,
  MediaType,
  requestPermissionsAsync,
} from 'expo-media-library';
import PickerPicture from './PickerPicture';
import {clamp} from '../../utils/animation';
import Constants from 'expo-constants';

type ImagePickerProps = {
  translateY: Animated.SharedValue<number>;
  onCrop: () => void;
};

const getAssets = async (): Promise<Asset[]> => {
  const albums = await getAlbumsAsync();
  const assets: Asset[] = [];
  for (let album of albums) {
    const albumAssets = await getAssetsAsync({
      album: album.id,
      mediaType: MediaType.photo,
      first: 100,
      sortBy: 'modificationTime',
    });

    assets.push(...albumAssets.assets);
  }

  return assets;
};

const {width, height} = Dimensions.get('window');

const COL = 3;
const SIZE = width / 3;

function getItemLayout(
  _: any,
  index: number,
): {offset: number; length: number; index: number} {
  return {
    index,
    offset: SIZE * Math.floor(index / COL),
    length: SIZE,
  };
}

function keyExtractor(asset: Asset, index: number): string {
  return `tile-${asset.uri}-${index}`;
}

function renderItem(info: ListRenderItemInfo<Asset>): React.ReactElement {
  return <PickerPicture asset={info.item} index={info.index} />;
}

const ImagePicker: React.FC<ImagePickerProps> = ({translateY}) => {
  const ref = useAnimatedRef<Animated.FlatList<Asset>>();
  const [assets, setAssets] = useState<Asset[]>([{} as Asset]);

  const offsetY =
    (Math.ceil(assets.length / 3) + 1) * SIZE -
    height -
    Constants.statusBarHeight;

  const scroll = useSharedValue<number>(0);
  const offset = useSharedValue<number>(0);

  const pan = Gesture.Pan()
    .onStart(_ => {
      offset.value = scroll.value;
      cancelAnimation(scroll);
    })
    .onChange(e => {
      const offY = Math.max(offsetY, 0);
      scroll.value = clamp(offset.value + e.translationY, -1 * offY, 0);
      scrollTo(ref, 0, -1 * scroll.value, false);
    })
    .onEnd(({velocityY}) => {
      scroll.value = withDecay({velocity: velocityY});
    });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
    };
  });

  useEffect(() => {
    (async () => {
      const {granted} = await requestPermissionsAsync();
      if (granted) {
        const allAssets = await getAssets();
        setAssets([...allAssets]);
      } else {
        Alert.alert(
          'Image library permission has not been granted, come back when the permission is granted.',
        );
      }
    })();
  }, []);

  return (
    <View style={styles.rootContainer}>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.root, rStyle]}>
          <View style={styles.header}>
            <Text style={styles.title}>Select a picture</Text>
          </View>

          <Animated.FlatList
            ref={ref}
            data={assets}
            numColumns={COL}
            scrollEnabled={false}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={false}
            contentContainerStyle={styles.content}
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    position: 'absolute',
    backgroundColor: 'orange',
    width,
    height: height - Constants.statusBarHeight,
  },
  root: {
    position: 'absolute',
    top: height,
    width,
    height: height - Constants.statusBarHeight,
    backgroundColor: '#fff',
    // overflow: 'hidden',
  },
  header: {
    width,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  title: {
    fontFamily: 'UberBold',
    color: '#000',
  },
  content: {
    width,
    backgroundColor: '#fff',
  },
});

export default ImagePicker;
