import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  TextInput,
  Image,
  StatusBar,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Icon from '@expo/vector-icons/Ionicons';
import {impactAsync, ImpactFeedbackStyle} from 'expo-haptics';
import RNBootSplash from 'react-native-bootsplash';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {StackScreens} from '../../navigation/stackScreens';
import withKeyboard from '../../utils/hoc/withKeyboard';
import {mmkv} from '../../utils/mmkv';
import {User, UsernamePasswordLogin, TokenResponse} from '../../utils/types';
import Button from '../../utils/components/Button';
import {apiAuthLogin, apiUsersMeUrl} from '../../utils/urls';
import {axiosInstance} from '../../utils/axiosInstance';
import Toast from '../../misc/Toast';

const {width} = Dimensions.get('window');

type LoginProps = {
  route: RouteProp<StackScreens, 'Login'>;
  navigation: NavigationProp<StackScreens, 'Login'>;
};

const Login: React.FC<LoginProps> = ({route, navigation}) => {
  const login = useRef<UsernamePasswordLogin>({username: '', password: ''});
  const [isSecure, setisSecure] = useState<boolean>(true);

  const toggleIsSecure = async () => {
    await impactAsync(ImpactFeedbackStyle.Light);
    setisSecure(s => !s);
  };

  const onChangeText = (text: string, type: 'username' | 'password') => {
    if (type === 'username') {
      login.current.username = text;
    }

    if (type === 'password') {
      login.current.password = text;
    }
  };

  const signIn = async () => {
    navigation.navigate('Modal');
    try {
      const {data} = await axiosInstance.post<TokenResponse>(
        apiAuthLogin,
        login.current,
      );

      // authState.tokens = data;
      mmkv.set('tokens', JSON.stringify(data));

      const {data: user} = await axiosInstance.get<User>(apiUsersMeUrl);
      // authState.user = user;
    } catch (e) {}
  };

  const pushToCreateAccount = () => {
    navigation.navigate('CreateAccount');
  };

  useEffect(() => {
    RNBootSplash.hide({fade: true});
  }, []);

  useEffect(() => {
    if (route.params.createdAccount) {
      console.log('An account was created');
    }
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={'#fff'} barStyle={'light-content'} />
      <View style={styles.loginContainer}>
        <Image source={require('../../assets/react.png')} style={styles.logo} />

        <View>
          <Text style={styles.login}>Login</Text>

          <View style={styles.textInputContainer}>
            <Icon
              name={'ios-person'}
              size={22}
              color={'#9E9EA7'}
              style={styles.icon}
            />
            <TextInput
              style={styles.textInput}
              placeholder={'Email / Username'}
              onChangeText={t => onChangeText(t, 'username')}
              autoCapitalize={'none'}
            />
          </View>

          <View style={styles.textInputContainer}>
            <Icon
              name={'ios-lock-closed'}
              size={22}
              color={'#9E9EA7'}
              style={styles.icon}
            />
            <TextInput
              style={styles.textInput}
              secureTextEntry={isSecure}
              placeholder={'Password'}
              onChangeText={t => onChangeText(t, 'password')}
              autoCapitalize={'none'}
            />
            <Pressable onPress={toggleIsSecure} hitSlop={40}>
              <Icon
                name={isSecure ? 'eye' : 'eye-off'}
                size={22}
                color={'#9E9EA7'}
              />
            </Pressable>
          </View>

          <View>
            <Button
              text="Login"
              width={width * 0.9}
              onPress={signIn}
              extraStyle={styles.extraStyle}
            />

            <View style={styles.newToContainer}>
              <Text style={styles.newText}>New to Kio?</Text>
              <Pressable hitSlop={20} onPress={pushToCreateAccount}>
                <Text style={styles.register}> Register</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      {route.params.createdAccount ? (
        <Toast
          type="success"
          message="Your account has been created successfully"
          title="Account created!"
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.05,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 10,
    // paddingBottom: statusBarHeight,
  },
  logo: {
    marginTop: 10,
    width: width / 2.3,
    height: width / 2.3,
    alignSelf: 'center',
  },
  login: {
    fontFamily: 'UberBold',
    color: '#000',
    fontSize: 22,
    marginBottom: 10,
  },
  textInputContainer: {
    height: 45,
    width: width * 0.9,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F4',
    borderRadius: 5,
    marginVertical: 10,
    padding: 10,
  },
  icon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: 45,
    fontFamily: 'Uber',
    backgroundColor: '#F3F3F4',
    color: '#C5C8D7',
  },
  forgotPassword: {
    fontFamily: 'UberBold',
    color: 'rgba(51, 102, 255, 0.65)',
    alignSelf: 'flex-end',
  },
  extraStyle: {
    marginVertical: 10,
  },
  newToContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  newText: {
    fontFamily: 'UberBold',
  },
  register: {
    fontFamily: 'UberBold',
    color: '#3366ff',
  },
});

export default withKeyboard(Login);
