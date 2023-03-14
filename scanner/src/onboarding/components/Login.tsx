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
import {axiosInstance} from '../../utils/axiosInstance';
import {apiAuthLogin} from '../../utils/urls';
import Button from '../../utils/components/Button';
import withKeyboard from '../../utils/hoc/withKeyboard';
import {mmkv} from '../../utils/mmkv';
import {StackScreens, TokenResponse} from '../../utils/types';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import Toast from '../../misc/Toast';
import {ACCOUNT_CREATED_INFO, INVALID_CREDENTIALS} from '../utils/constants';
import {PADDING} from '../../utils/constants';
import {useDispatch} from 'react-redux';
import {
  setAuthenticationTokens,
  setIsAuthenticated,
} from '../../store/slices/authSlice';
import {AxiosError} from 'axios';

const SPACING = 16;
const {width} = Dimensions.get('window');

type EmailPasswrodLogin = {
  email: string;
  password: string;
};

type LoginProps = {
  navigation: NavigationProp<StackScreens, 'Login'>;
  route: RouteProp<StackScreens, 'Login'>;
};

const Login: React.FC<LoginProps> = ({route, navigation}) => {
  const accountCreated = route.params.createdAccount;
  const dispatch = useDispatch();

  const loginData = useRef<EmailPasswrodLogin>({email: '', password: ''});
  const [disabled, setDisabled] = useState<boolean>(false);
  const [isSecureText, setIsSecureText] = useState<boolean>(true);
  const [invalidCredentials, setInvalidCredentials] = useState<boolean>(false);

  const toggleIsSecure = async () => {
    await impactAsync(ImpactFeedbackStyle.Light);
    setIsSecureText(s => !s);
  };

  const onChangeText = (text: string, field: 'email' | 'password') => {
    loginData.current[field] = text;
    setDisabled(false);
  };

  const login = async () => {
    setDisabled(true);
    try {
      const {headers} = await axiosInstance.post<TokenResponse>(
        apiAuthLogin,
        loginData.current,
      );

      const accessToken = headers.authorization;
      const refreshToken = headers['refresh-token'];

      mmkv.set('tokens', JSON.stringify({accessToken, refreshToken}));
      dispatch(setIsAuthenticated(true));
      dispatch(setAuthenticationTokens({accessToken, refreshToken}));
    } catch (e) {
      const response = (e as AxiosError).response;
      if (response?.status === 403) {
        setInvalidCredentials(true);
      }
    } finally {
      setDisabled(false);
    }
  };

  const pushToCreateAccount = () => {
    navigation.navigate('CreateAccount');
  };

  useEffect(() => {
    RNBootSplash.hide({fade: true});
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
              placeholder={'Email'}
              onChangeText={t => onChangeText(t, 'email')}
              autoCapitalize={'none'}
            />
          </View>

          <View
            style={[styles.textInputContainer, {marginBottom: PADDING / 2}]}>
            <Icon
              name={'ios-lock-closed'}
              size={22}
              color={'#9E9EA7'}
              style={styles.icon}
            />
            <TextInput
              style={styles.textInput}
              secureTextEntry={isSecureText}
              placeholder={'Password'}
              onChangeText={t => onChangeText(t, 'password')}
              autoCapitalize={'none'}
            />
            <Pressable onPress={toggleIsSecure} hitSlop={40}>
              <Icon
                name={isSecureText ? 'eye' : 'eye-off'}
                size={22}
                color={'#9E9EA7'}
              />
            </Pressable>
          </View>

          <View>
            <Text style={styles.forgotPassword}>Forgot password?</Text>
            <Button
              text="Login"
              width={width * 0.9}
              onPress={login}
              action={'accept'}
              disabled={disabled}
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
      {accountCreated ? <Toast {...ACCOUNT_CREATED_INFO} /> : null}
      {invalidCredentials ? (
        <Toast
          {...INVALID_CREDENTIALS}
          onAnimationEnd={() => setInvalidCredentials(false)}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: SPACING,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: SPACING,
  },
  logo: {
    marginTop: SPACING,
    width: 150,
    height: 150,
    alignSelf: 'center',
  },
  login: {
    fontFamily: 'UberBold',
    color: '#000',
    fontSize: 22,
  },
  textInputContainer: {
    height: 45,
    width: width * 0.9,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F4',
    borderRadius: 5,
    marginVertical: PADDING / 2,
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
    // marginVertical: PADDING / 2,
  },
  extraStyle: {
    marginVertical: PADDING,
  },
  newToContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
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
