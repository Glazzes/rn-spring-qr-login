import {View, Text, StyleSheet, Image} from 'react-native';
import React, {useEffect} from 'react';
import {useSnapshot} from 'valtio';
import {authState, setIsAuthenticated, setUser} from '../../utils/authStore';
import {getProfilePictureUrl, loggedInUser} from '../../utils/urls';
import { axiosInstance } from '../../utils/axiosInstace';
import Button from '../../shared/Button';

const PADDING = 16;
const HEADER_SIZE = 60;
const IMAGE_SIZE = HEADER_SIZE - PADDING;

const Home: React.FC = () => {
  const state = useSnapshot(authState);
  const profilePicture = getProfilePictureUrl(state.user.profilePicture);

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
  }

  useEffect(() => {
    axiosInstance
      .get(loggedInUser)
      .then(({data}) => setUser(data))
      .catch((e) => console.log(e));
  }, []);

  if(!state.isAuthenticated) {
    return <View />
  }

  return (
    <View style={styles.root}>
      <View style={styles.appbar}>
        <View>
          <Text>Hi,</Text>
          <Text style={styles.username}>{state.user.username}</Text>
        </View>
        <Image source={{uri: profilePicture}} style={styles.image} />
      </View>
      <View style={styles.body}>
        <Text style={styles.info}>All of your data would be here, if you had any {':D'}</Text>
        <Button action={'decline'} text={'Log out'} onPress={logout} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appbar: {
    width: '100%',
    height: HEADER_SIZE,
    paddingHorizontal: PADDING,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: {height: 2, width: 0},
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
  },
  username: {
    color: '#2C3639',
    fontWeight: 'bold',
    fontSize: 15,
    textTransform: 'capitalize'
  },
  text: {
    color: '#2C3639',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 10,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  info: {
    fontSize: 15,
    marginBottom: 16,
  }
});

export default Home;
