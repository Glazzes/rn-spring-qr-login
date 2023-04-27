import React from 'react';

import {View, Text, StyleSheet, Pressable} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import IonIcons from '@expo/vector-icons/Ionicons';
import Button from './Button';

const Modal = () => {
  const navigation = useNavigation(); 

  const closeModal = () => {
    const canGoBack = navigation.canGoBack();
    if(canGoBack) {
        navigation.goBack();
    }
  }

  return (
    <View style={styles.root}>
      <View style={styles.modal}>
        <Pressable style={styles.close} onPress={closeModal}>
          <IonIcons name={"close"} size={20} />
        </Pressable>
        <Text style={styles.title}>Warning</Text>
        <Text style={styles.subtitle}>
            Due to Google's Play Store account fee i could not upload this application to the
            Play Store, as i can not currently afford to pay for it. I'm very sorry for the inconvenient. 
        </Text>
        <a href="https://github.com/Glazzes/rn-spring-qr-login/raw/main/app-release.apk" style={styles.link}>
         <Button 
            text='Download' 
            action='accept' 
            width={100} 
            onPress={closeModal}
            extraStyle={{marginTop: 16}} 
          />
        </a>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)"
  },
  modal: {
    width: 280,
    padding: 16,
    borderRadius: 10,
    backgroundColor: "#fff"
  },
  title: {
    fontFamily: "ExtraBold",
    fontSize: 20,
    marginBottom: 8
  },
  subtitle: {
    fontFamily: "SemiBold",
    color: "#475569"
  },
  link: {
    alignSelf: "flex-end",
    textDecorationLine: "none",
  },
  close: {
    position: 'absolute',
    right: 16,
    top: 16
  }
});

export default Modal;
