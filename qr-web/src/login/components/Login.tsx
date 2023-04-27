import React from 'react';

import {View, StyleSheet, Image, Text, useWindowDimensions} from 'react-native';
import EmailPasswordLogin from './EmailPasswordLogin';
import Footer from '../../shared/Footer';
import IonIcons from '@expo/vector-icons/Ionicons';
import QrCodeLogin from './QrCodeLogin';

const Login: React.FC = () => {
  const {width, height} = useWindowDimensions();
  const isPortait = height > width;

  return (
    <View style={styles.root}>
      <View style={styles.appbar}>
        <View style={{flexDirection: "row", alignItems: "center"}}>
          <Image source={require("../../../assets/react.png")} style={styles.image} />
          <Text style={styles.title}>React Native Spring Boot QR Login</Text>
        </View>
        <a href="https://github.com/Glazzes/rn-spring-qr-login" target={"_blank"} style={{textDecorationLine: "none"}} >
          <IonIcons name="ios-logo-github" color={"#3366ff"} size={30} />
        </a>
      </View>
      <View style={isPortait ? styles.rootPortrait : styles.rootLandscape}>
        <EmailPasswordLogin />
        <QrCodeLogin />
      </View>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    alignItems: "center"
  },
  appbar: {
    height: 62,
    width: "100%",
    paddingHorizontal: 16,
    shadowColor: "rgba(0, 0, 0, 0.5)",
    shadowRadius: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  image: {
    height: 40,
    width: 40,
  },
  title: {
    fontFamily: "ExtraBold",
    fontSize: 20,
    marginLeft: 16
  },
  rootPortrait: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rootLandscape: {
    
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default Login;
