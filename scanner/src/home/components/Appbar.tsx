import React, {useEffect} from 'react';
import {apiUsersMeUrl, getProfilePictureUrl} from '../../utils/urls';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import {View, Dimensions, Image, StyleSheet, Text} from 'react-native';
import Constants from 'expo-constants';
import {PADDING} from '../../utils/constants';
import {axiosInstance} from '../../utils/axiosInstance';
import {User} from '../../utils/types';
import {setCurrentUser} from '../../store/slices/authSlice';

const IMAGE_SIZE = 40;

const {width} = Dimensions.get('window');

const Appbar: React.FC = () => {
  const dispatch = useDispatch();
  const selector = useSelector((state: RootState) => state.auth);
  const imageUrl = getProfilePictureUrl(selector.user.profilePicture);

  useEffect(() => {
    axiosInstance.get<User>(apiUsersMeUrl).then(({data}) => {
      dispatch(setCurrentUser(data));
    });
    // .catch(e => console.log(e.response));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.appbar}>
      {selector.user.username !== '' ? (
        <View>
          <Text style={styles.welcome}>Hi,</Text>
          <Text style={styles.username}>{selector.user.username}</Text>
        </View>
      ) : (
        <View style={styles.textPlaceHolderContainer}>
          <View style={styles.textPlaceHolder} />
          <View style={[styles.textPlaceHolder, {width: 60}]} />
        </View>
      )}
      {selector.user.profilePicture === '' ? (
        <View style={[styles.image, styles.imagePlaceHolder]} />
      ) : (
        <Image source={{uri: imageUrl}} style={styles.image} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  appbar: {
    height: Constants.statusBarHeight * 2,
    width: width,
    paddingHorizontal: PADDING,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wrapper: {
    flexDirection: 'row',
  },
  imagePlaceHolder: {
    backgroundColor: '#eee',
  },
  image: {
    height: IMAGE_SIZE,
    width: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
  },
  textPlaceHolderContainer: {
    height: IMAGE_SIZE,
    width: IMAGE_SIZE,
    justifyContent: 'space-around',
  },
  textPlaceHolder: {
    height: 10,
    width: 30,
    borderRadius: 2,
    backgroundColor: '#eee',
  },
  welcome: {
    color: '#000',
  },
  username: {
    textTransform: 'capitalize',
    fontSize: 17,
    fontFamily: 'UberBold',
    color: '#000',
  },
});

export default Appbar;
