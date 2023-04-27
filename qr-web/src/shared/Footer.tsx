import React from 'react';
import IonIcons from '@expo/vector-icons/Ionicons';
import {View, Text, StyleSheet} from 'react-native';


const Footer = () => {
  return (
    <View style={{marginBottom: 16}}>
      <View style={styles.row}>
        <a href="https://github.com/Glazzes" target={"_blank"} style={styles.link}>
          <IonIcons name='ios-logo-github' size={24} color={"#3366ff"} style={styles.icon} />
        </a>
        <a href="https://www.linkedin.com/in/santizapatap1/" target={"_blank"} style={styles.link}>
          <IonIcons name='ios-logo-linkedin' size={24} color={"#3366ff"} style={styles.icon} />
        </a>
      </View>
      <View style={styles.row}>
        <Text style={styles.text}>Made With </Text>
        <IonIcons name='ios-heart' size={24} color={"#ff88cc"} />
        <Text style={styles.text}> By Santiago</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: "SemiBold",
    color: "#000"
  },
  icon: {
    marginHorizontal: 8
  },
  link: {
    textDecorationLine: "none"
  }
});

export default Footer;