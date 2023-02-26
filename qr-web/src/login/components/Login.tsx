import {View, Text, StyleSheet} from "react-native";
import React from "react";
import {SIZE} from "../../utils/contants";
import UsernamePasswordLogin from "./UsernamePasswordLogin";
import QrCodeLogin from "./QrCodeLogin";

type LoginProps = {};

const Login: React.FC<LoginProps> = ({}) => {
  return (
    <View style={styles.root}>
      <UsernamePasswordLogin />
      <View style={styles.divider} />
      <QrCodeLogin />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  divider: {
    width: 2,
    height: SIZE - 10,
    backgroundColor: "#2C3639",
    marginHorizontal: 30,
  },
});

export default Login;
