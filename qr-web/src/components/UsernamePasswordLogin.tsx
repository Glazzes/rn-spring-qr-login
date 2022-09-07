import {View, Text, StyleSheet, Dimensions, TextInput, Pressable, Image} from "react-native";
import React, {useState} from "react";
import {passwordLogin} from "../utils/urls";
import {SIZE} from "../utils/contants";

const {width} = Dimensions.get("window");
const INPUT_WIDTH = width * 0.75;

const UsernamePasswordLogin = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setpassword] = useState<string>("");

  const onUsernameChange = (text: string) => {
    setUsername(text);
  };

  const onPasswordChange = (text: string) => {
    setpassword(text);
  };

  const login = () => {
    fetch(passwordLogin, {method: "POST", body: JSON.stringify({username, password})}).then((res) =>
      console.log(res.headers),
    );
  };

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Welcome! log in</Text>
      <TextInput placeholder="Username" style={styles.input} onChangeText={onUsernameChange} />
      <TextInput
        placeholder="password"
        style={styles.input}
        onChangeText={onPasswordChange}
        secureTextEntry={true}
      />
      <Pressable style={styles.button} onPress={login}>
        <Text style={styles.buttonText}>Log in</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    height: SIZE,
    width: SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  input: {
    width: SIZE,
    height: 50,
    backgroundColor: "#f3f3f3",
    marginBottom: 15,
    borderRadius: 5,
    paddingHorizontal: 15,
  },
  title: {
    color: "#2C3639",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    width: SIZE,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#2C3639",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
});

export default UsernamePasswordLogin;
