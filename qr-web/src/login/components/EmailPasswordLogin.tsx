import {View, Text, StyleSheet, TextInput, Alert, Image} from 'react-native';
import React, {useState} from 'react';
import {apiAuthLogin} from '../../utils/urls';
import {SIZE} from '../../utils/contants';
import {setAccessToken, setIsAuthenticated} from '../../utils/authStore';
import {axiosInstance} from '../../utils/axiosInstace';
import Button from '../../shared/Button';
import {AxiosError} from 'axios';

type LoginErors = {
  email?: string;
  password?: string;
}

const EmailPasswordLogin = () => {
  const [data, setData] = useState({email: '', password: ''});
  const [error, setError] = useState<LoginErors>({email: undefined, password: undefined});

  const [disable, setDisabled] = useState<boolean>(false);
  const [isInvalidCredentails, setIsInvalidCredentails] = useState(false);

  const onChangeText = (text: string, field: 'email' | 'password') => {
    setIsInvalidCredentails(false);
    setData(prev => ({...prev, [field]: text}));
  }

  const login = () => {
    setDisabled(true);
    axiosInstance
      .post(apiAuthLogin, data)
      .then(response => {
        const accessToken = response.headers['authorization'];
        const refreshToken = response.headers['refresh-token'];
        console.log(response.headers)
        if (accessToken && refreshToken) {
          localStorage.setItem('tokens', JSON.stringify({accessToken, refreshToken}));
          setAccessToken(accessToken);
          setIsAuthenticated(true);
        } else {
          Alert.alert('Login successfull but no access token was present');
        }
      })
      .catch((e) => {
        console.log(e.response)
        const response = (e as AxiosError).response;
        if(!response) {
          return;
        }

        if(response.status === 400) {
          setError(response.data as LoginErors);
        }

        if(response.status === 403) {
          setIsInvalidCredentails(true);
        }
      })
      .finally(() => setDisabled(false));
  };

  return (
    <View style={styles.root}>
      <Image source={require('../../../assets/react.png')} style={styles.image} />
      <Text style={styles.title}>Login</Text>
      <TextInput placeholder="Email" style={styles.input} onChangeText={(t) => onChangeText(t, 'email')} />
      {
        error.email ?
          (
            <Text style={styles.error}>* {error.email}</Text>
          ) : null
      }
      
      <TextInput
        placeholder="password"
        style={styles.input}
        onChangeText={t => onChangeText(t, 'password')}
        secureTextEntry={true}
      />
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
  image: {
    width: 70,
    height: 70,
    marginBottom: 16,
    alignSelf: 'center'
  },
  input: {
    width: SIZE,
    height: 40,
    backgroundColor: '#f3f3f3',
    marginBottom: 16,
    marginVertical: 8,
    paddingHorizontal: 15,
    alignSelf: 'flex-start'
  },
  title: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 16,
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
