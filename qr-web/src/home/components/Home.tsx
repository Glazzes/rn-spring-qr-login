import {View, Text, StyleSheet, Image} from 'react-native';
import React, {useEffect} from 'react';
import {useSnapshot} from 'valtio';
import {authState, setUser} from '../../utils/authStore';
import axios from 'axios';
import {getProfilePictureUrl, loggedInUser} from '../../utils/urls';

const Home: React.FC = () => {
  const state = useSnapshot(authState);
  const profilePicture = getProfilePictureUrl(state.user.profilePicture);

  useEffect(() => {
    axios
      .get(loggedInUser, {headers: {Authorization: state.accessToken}})
      .then(({data}) => setUser(data))
      .catch((e) => console.log(e));
  }, []);

  return (
    <View style={styles.root}>
      <Image source={{uri: profilePicture}} style={styles.image} />
      <Text style={styles.text}>You have logged in successfully {state.user.username}!</Text>
      <Text style={styles.text}>
        User id {'=>'} {state.user.id}
      </Text>
      <Text style={styles.text}>
        Access token {'=>'} {state.accessToken}
      </Text>
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
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  text: {
    color: '#2C3639',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 10,
  },
});

export default Home;
