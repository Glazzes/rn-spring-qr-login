import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import Button from './Button';
import {NavigationProp} from '@react-navigation/native';
import {StackScreens} from '../utils/types';
import {useSnapshot} from 'valtio';
import {authState} from '../utils/authStore';
import {SIZE} from '../utils/contants';

type NotFoundProps = {
    navigation: NavigationProp<StackScreens, "NotFound">;
}

const NotFound: React.FC<NotFoundProps> = ({navigation}) => {
  const state = useSnapshot(authState);

  const goBack = () => {
    const isAuthenticated = state.isAuthenticated;

    if(isAuthenticated) {
      navigation.navigate("Home")
    }else {
      navigation.navigate("Login")
    }
  };

  return (
    <View style={styles.root}>
      <Image source={require("../../assets/react.png")} style={styles.image} />
      <Text style={styles.text}>404 Nothing to see here</Text>
      {/* @ts-ignore */}
      <Button text={state.isAuthenticated ? "Go home" : "Go back"} action={'accept'} onPress={goBack} width={SIZE / 2} />
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
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 16
  },
  image: {
    width: SIZE / 2,
    height: SIZE / 2,
   
  }
});

export default NotFound;