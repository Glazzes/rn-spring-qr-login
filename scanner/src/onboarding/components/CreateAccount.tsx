import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  TextInput,
  Image,
  ScrollView,
  BackHandler,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Icon from '@expo/vector-icons/Ionicons';
import {impactAsync, ImpactFeedbackStyle} from 'expo-haptics';
/*
import {NotificationType} from '../../enums/notification';
import {AxiosResponse} from 'axios';
import {apiUsersExistsUrl, apiUsersUrl} from '../../shared/requests/contants';
import Button from '../../shared/components/Button';
import {UserExists} from '../../shared/types';
import {displayToast, genericErrorMessage} from '../../shared/toast';
*/
import Constants from 'expo-constants';
import withKeyboard from '../../utils/hoc/withKeyboard';
import {axiosInstance} from '../../utils/axiosInstance';
import {AxiosResponse} from 'axios';
import {apiUsersUrl} from '../../utils/urls';
import Button from '../../utils/components/Button';
import {NavigationProp} from '@react-navigation/native';
import {StackScreens} from '../../navigation/stackScreens';
import {useSharedValue} from 'react-native-reanimated';
import ImagePicker from './ImagePicker';
import {useDispatch} from 'react-redux';
import {updatePassword, updateUsername} from '../../store/slices/accountSlice';

const statusBarHeight = Constants.statusBarHeight;

const {width, height} = Dimensions.get('window');

type AccountCreationErrors = {
  username: string | undefined;
  email: string | undefined;
  password: string | undefined;
};

type CreateAccountProps = {
  navigation: NavigationProp<StackScreens, 'CreateAccount'>;
};

const CreateAccount: React.FC<CreateAccountProps> = ({navigation}) => {
  const info = useRef({username: '', password: '', email: ''});

  const dispatch = useDispatch();
  const [isAccountValid, setIsAccountValid] = useState<boolean>(false);
  const [isSecure, setIsSecure] = useState<boolean>(true);
  const [fieldErrors, setFieldErrors] = useState<AccountCreationErrors>({
    username: undefined,
    email: undefined,
    password: undefined,
  });
  const [timer, setTimer] = useState();

  const translateY = useSharedValue<number>(-1 * height);

  const toggleIsSecure = async () => {
    await impactAsync(ImpactFeedbackStyle.Light);
    setIsSecure(s => !s);
  };

  const goBack = () => {
    const canGoBack = navigation.canGoBack();
    if (canGoBack) {
      navigation.goBack();
    }
  };

  const onChangeWithCheck = (text: string, field: 'username' | 'email') => {
    if (field === 'username') {
      dispatch(updateUsername(text));
    }

    if (field === 'email') {
      dispatch(updatePassword(text));
    }

    info.current[field] = text;
    setFieldErrors(errors => ({...errors, [field]: undefined}));

    if (timer) {
      clearTimeout(timer);
    }

    const newTimer = setTimeout(async () => {
      try {
        const {data} = await axiosInstance.get<boolean>('', {
          params: {
            username: text.toLocaleLowerCase(),
            email: text.toLocaleLowerCase(),
          },
        });

        setFieldErrors(err => {
          if (data) {
            err.email = '* An account is already registered with this email';
          }

          return {...err};
        });
      } catch (e) {}
    }, 1000);

    setTimer(newTimer);
  };

  const onChangeText = (text: string, field: 'username' | 'password') => {
    info.current[field] = text;
    setFieldErrors(err => ({...err, [field]: undefined}));
  };

  const createAccount = async () => {
    try {
      await axiosInstance.post(apiUsersUrl, info.current);

      /*
      displayToast({
        title: 'Account created',
        message:
          'Your account has been created successfuly, you can now login!',
        type: NotificationType.SUCCESS,
      })
      */

      // Navigation.pop(componentId);
    } catch ({response}) {
      const res = response as AxiosResponse;
      if (res.status === 400) {
        setFieldErrors(err => ({...err, ...res.data}));
        return;
      }

      // displayToast(genericErrorMessage);
    }
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        return !isAccountValid;
      },
    );

    return () => {
      subscription.remove();
    };
  }, [isAccountValid]);

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.content}
        stickyHeaderIndices={[0]}>
        <View style={styles.topbar}>
          <Pressable onPress={goBack} hitSlop={40}>
            <Icon name={'ios-arrow-back'} color={'#000'} size={22} />
          </Pressable>
        </View>

        <Image source={require('../../assets/react.png')} style={styles.logo} />

        <Text style={styles.signUp}>Sign up</Text>

        <View>
          <View style={styles.textInputContainer}>
            <Icon
              name={'ios-at'}
              size={22}
              color={'#9E9EA7'}
              style={styles.icon}
            />
            <TextInput
              style={styles.textInput}
              placeholder={'Email'}
              onChangeText={text => onChangeWithCheck(text, 'email')}
              autoCapitalize={'none'}
            />
          </View>
          {fieldErrors.email && (
            <Text style={styles.error}>{fieldErrors.email}</Text>
          )}
        </View>

        <View>
          <View style={styles.textInputContainer}>
            <Icon
              name={'ios-person'}
              size={22}
              color={'#9E9EA7'}
              style={styles.icon}
            />
            <TextInput
              style={styles.textInput}
              placeholder={'Username'}
              onChangeText={text => onChangeWithCheck(text, 'username')}
              autoCapitalize={'none'}
            />
          </View>
          {fieldErrors.username && (
            <Text style={styles.error}>{fieldErrors.username}</Text>
          )}
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
            placeholder={'Password'}
            secureTextEntry={isSecure}
            onChangeText={text => onChangeText(text, 'password')}
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
        {fieldErrors.password && (
          <Text style={styles.error}>{fieldErrors.password}</Text>
        )}

        <View style={styles.buttonContainer}>
          <Text style={styles.joined}>
            By signing up, you're agree to{' '}
            <Text style={styles.login}>terms and conditions</Text> and our{' '}
            <Text style={styles.login}>privicy policy.</Text>
          </Text>

          <Button
            text="Confirm"
            disabled={
              (fieldErrors.username ||
                fieldErrors.email ||
                fieldErrors.password) as unknown as boolean
            }
            width={width * 0.9}
            onPress={createAccount}
            extraStyle={styles.buttonMargin}
          />

          <View style={styles.joinedContainer}>
            <Text style={styles.joined}>Joined us before?</Text>
            <Pressable hitSlop={20} onPress={goBack}>
              <Text style={styles.login}> Login</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <ImagePicker translateY={translateY} onCrop={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: width * 0.05,
  },
  content: {
    paddingBottom: statusBarHeight,
  },
  topbar: {
    width,
    height: statusBarHeight * 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width / 2.4,
    height: width / 2.4,
    marginTop: 20,
    marginBottom: 30,
    alignSelf: 'center',
  },
  signUp: {
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
  error: {
    fontFamily: 'UberBold',
    marginLeft: 10,
    marginBottom: 10,
    color: '#ee3060',
    fontSize: 12,
  },
  buttonContainer: {
    marginTop: 10,
  },
  buttonMargin: {
    marginVertical: 10,
  },
  joinedContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  joined: {
    fontFamily: 'UberBold',
    fontSize: 12,
  },
  login: {
    fontFamily: 'UberBold',
    color: '#3366ff',
    fontSize: 12,
  },
});

export default withKeyboard(CreateAccount);
