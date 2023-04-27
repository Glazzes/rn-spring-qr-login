import React from 'react';

import {View, StyleSheet, useWindowDimensions, Pressable, Text} from 'react-native';
import EmailPasswordLogin from './EmailPasswordLogin';
import Footer from '../../shared/Footer';
import IonIcons from '@expo/vector-icons/Ionicons';
import QrCodeLogin from './QrCodeLogin';
import {NavigationProp} from '@react-navigation/native';
import {StackScreens} from '../../utils/types';

type LoginProps = {
  navigation: NavigationProp<StackScreens, 'Login'>;
}

const Login: React.FC<LoginProps> = ({navigation}) => {
  const {width, height} = useWindowDimensions();
  const isPortait = height > width;

  return (
    <View style={{flex: 1}}>
      <View style={styles.root}>
        <View style={{alignItems: "center"}}>
          <View style={{flexDirection: "row"}}>
            <EmailPasswordLogin />
            <QrCodeLogin />
          </View>
          <Pressable style={styles.button} onPress={() => {
            navigation.navigate('Modal')
          }}>
            <IonIcons name={"logo-android"} color={"#fff"} size={24} />
            <Text style={styles.text}>Get the app</Text>
          </Pressable>
        </View>
      </View>
    <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    maxWidth: 180,
    backgroundColor: "#00de7a",
    padding: 8,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    fontFamily: "ExtraBold",
    color: "#fff",
    marginLeft: 16
  },
  rootPortrait: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rootLandscape: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default Login;
