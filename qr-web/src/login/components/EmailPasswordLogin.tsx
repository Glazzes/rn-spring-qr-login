import {View, Text, StyleSheet, TextInput, Alert, Image, Pressable} from 'react-native';
import React, {useState} from 'react';
import {apiAuthLogin} from '../../utils/urls';
import {SIZE} from '../../utils/contants';
import {setAccessToken, setIsAuthenticated} from '../../utils/authStore';
import {axiosInstance} from '../../utils/axiosInstace';
import Button from '../../shared/Button';
import {AxiosError} from 'axios';
import IonIcons from '@expo/vector-icons/Ionicons';

type LoginErors = {
  email?: string;
  password?: string;
}

const EmailPasswordLogin = () => {
  const [data, setData] = useState({email: '', password: ''});
  const [error, setError] = useState<LoginErors>({email: undefined, password: undefined});

  const [isSecure, setIsSecure] = useState<boolean>(true);
  const [disable, setDisabled] = useState<boolean>(false);
  const [isInvalidCredentails, setIsInvalidCredentails] = useState(false);

  const onChangeText = (text: string, field: 'email' | 'password') => {
    setIsInvalidCredentails(false);
    setData(prev => ({...prev, [field]: text}));
  }

  const login = async () => {
    setDisabled(true);

    try {
      const {headers} = await axiosInstance.post(apiAuthLogin, data);
      const accessToken = headers['authorization'];
      const refreshToken = headers['refresh-token'];

      localStorage.setItem("tokens", JSON.stringify({accessToken, refreshToken}));
      setAccessToken(accessToken);
      setIsAuthenticated(true);
    }catch(e) {
      const response = (e as AxiosError).response;
      if (response?.status === 403) {
        setIsInvalidCredentails(true);
      }
    }finally {
      setDisabled(false);
    }
  };

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Login</Text>

      <Text style={styles.label}>Email Address</Text>
      <TextInput 
        placeholder="appuser@demo.com"
        placeholderTextColor={"#475569"}
        style={styles.input} 
        onChangeText={(t) => onChangeText(t, 'email')} 
      />
      {
        error.email ?
          (
            <Text style={styles.error}>* {error.email}</Text>
          ) : null
      }
      
      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordInputContainer}>
        <TextInput
          placeholder="password"
          placeholderTextColor={"#475569"}
          style={styles.passwordInput}
          onChangeText={t => onChangeText(t, 'password')}
          secureTextEntry={isSecure}
        />
        <Pressable onPress={() => setIsSecure(s => !s)} style={styles.icon}>
          <IonIcons name={isSecure ? 'eye' : 'eye-off'} color={"#475569"} size={20} />
        </Pressable>
      </View>
      {
        error.password ?
          (
            <Text style={styles.error}>* {error.password}</Text>
          ) : null
      }
      {
        isInvalidCredentails ?
          (
            <Text style={styles.error}>* Invalid credentials</Text>
          ) : null
      }
      <Button text={'Log in'} action={'accept'} width={SIZE} disabled={disable} onPress={login} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    height: SIZE,
    width: SIZE,
    justifyContent: 'center'
  },
  title: {
    color: '#000',
    fontFamily: "ExtraBold",
    fontSize: 20,
    marginBottom: 16,
  },
  label: {
    fontFamily: "SemiBold",
    color: "#475569"
  },
  input: {
    width: SIZE,
    height: 44,
    backgroundColor: '#f3f3f3',
    marginBottom: 16,
    marginVertical: 8,
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
    fontFamily: "Regular"
  },
  passwordInputContainer: {
    height: 44,
    width: SIZE,
    flexDirection: "row",
    backgroundColor: "#f3f3f3",
    marginBottom: 16,
    marginVertical: 8,
    paddingHorizontal: 15,
  },
  passwordInput: {
    flex: 1,
  },
  icon: {
    alignSelf: "center"
  },
  error: {
    color: '#E94560',
    fontWeight: '500',
    marginVertical: 4,
  },
  button: {
    width: SIZE,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#3366ff',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  },
});

export default EmailPasswordLogin;
