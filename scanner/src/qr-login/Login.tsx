import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {Pressable} from 'native-base';
import axios from 'axios';
import {passwordLogin} from '../utils/urls';
import {setAccessToken} from '../store/authStore';

const {width} = Dimensions.get('window');
const INPUT_WIDTH = width * 0.75;

const Login = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setpassword] = useState<string>('');

  const onUsernameChange = (text: string) => {
    setUsername(text);
  };

  const onPasswordChange = (text: string) => {
    setpassword(text);
  };

  const login = async () => {
    try {
      const res = await axios.post(passwordLogin, {username, password});
      const token = res.headers['Authorization'];
      if (token) {
        setAccessToken(token);
      }
    } catch (e) {
      Alert.alert('Error while logging in');
    }
  };

  return (
    <View style={styles.root}>
      <Image
        source={require('./react.png')}
        style={styles.image}
        resizeMode={'cover'}
      />
      <Text style={styles.title}>Welcome! log in</Text>
      <TextInput
        placeholder="Username"
        style={styles.input}
        onChangeText={onUsernameChange}
      />
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
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  input: {
    width: INPUT_WIDTH,
    height: 50,
    backgroundColor: '#f3f3f3',
    marginBottom: 15,
    borderRadius: 5,
    paddingHorizontal: 15,
  },
  title: {
    color: '#2C3639',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    width: INPUT_WIDTH,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#000',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default Login;
