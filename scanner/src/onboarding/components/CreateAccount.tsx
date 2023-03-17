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
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from '@expo/vector-icons/Ionicons';
import {impactAsync, ImpactFeedbackStyle} from 'expo-haptics';
import Constants from 'expo-constants';
import withKeyboard from '../../utils/hoc/withKeyboard';
import {axiosInstance} from '../../utils/axiosInstance';
import {apiUsersExistsByEmailUrl, apiUsersValidateUrl} from '../../utils/urls';
import Button from '../../utils/components/Button';
import {NavigationProp} from '@react-navigation/native';
import {useSharedValue, withTiming} from 'react-native-reanimated';
import ImagePicker from './ImagePicker';
import {useDispatch, useSelector} from 'react-redux';
import {updateField} from '../../store/slices/accountSlice';
import {AccountCreationFields, StackScreens} from '../../utils/types';
import {RootState} from '../../store/store';
import {AxiosError} from 'axios';
import {IMAGE_SIZE} from '../utils/constants';
import {requestPermissionsAsync} from 'expo-media-library';

const SPACING = 16;
const statusBarHeight = Constants.statusBarHeight;

const {width, height} = Dimensions.get('window');

type AccountCreationErrors = {
  username: string | undefined;
  email: string | undefined;
  password: string | undefined;
  confirmation: string | undefined;
};

type CreateAccountProps = {
  navigation: NavigationProp<StackScreens, 'CreateAccount'>;
};

const CreateAccount: React.FC<CreateAccountProps> = ({navigation}) => {
  const dispatch = useDispatch();
  const select = useSelector((state: RootState) => state.account);

  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isHiddenPassword, setIsHiddenPassword] = useState<boolean>(true);
  const [isHiddentConfirmation, setIsHiddentConfirmation] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<AccountCreationErrors>({
    username: undefined,
    email: undefined,
    password: undefined,
    confirmation: undefined,
  });
  const [timer, setTimer] = useState();

  const translateY = useSharedValue<number>(0);

  const toggleIsSecure = async () => {
    await impactAsync(ImpactFeedbackStyle.Light);
    setIsHiddenPassword(s => !s);
  };

  const goBack = () => {
    const canGoBack = navigation.canGoBack();
    if (canGoBack) {
      navigation.goBack();
    }
  };

  const onChangeText = (text: string, field: AccountCreationFields) => {
    setFieldErrors(errors => ({...errors, [field]: undefined}));
    dispatch(updateField({name: field, value: text}));

    if (field === 'email') {
      if (timer) {
        clearTimeout(timer);
      }

      const newTimer = setTimeout(async () => {
        try {
          const {data} = await axiosInstance.get<boolean>(
            apiUsersExistsByEmailUrl,
            {
              params: {
                email: text.toLocaleLowerCase(),
              },
            },
          );

          setFieldErrors(err => {
            if (data) {
              err.email = '* An account is already registered with this email';
            }

            return {...err};
          });
        } catch (e) {}
      }, 500);

      // @ts-ignore
      setTimer(newTimer);
    }
  };

  const validateAccountDetails = async () => {
    if (select.password !== select.confirmation) {
      setFieldErrors(err => {
        err.confirmation = '* Passwords do not match';
        return {...err};
      });

      return;
    }

    setIsValidating(true);

    try {
      const body = {
        username: select.username,
        password: select.password,
        email: select.email,
      };

      await axiosInstance.post(apiUsersValidateUrl, body);
      try {
        const result = await requestPermissionsAsync();
        setHasPermission(result.granted);
        if (result.granted) {
          translateY.value = withTiming(-1 * height);
        }
      } catch (e) {
        Alert.alert(
          'Media library permission is required, grant it before proceding',
        );
      }
    } catch (e) {
      const response = (e as AxiosError).response;
      if (response?.status === 400) {
        const errors = response?.data as AccountCreationErrors;
        setFieldErrors(err => ({...err, ...errors}));
      }
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        return translateY.value < 0;
      },
    );

    return () => {
      subscription.remove();
    };
  }, [translateY]);

  return (
    <View style={styles.root}>
      <View style={styles.topbar}>
        <Pressable onPress={goBack} hitSlop={40}>
          <Icon name={'ios-arrow-back'} color={'#000'} size={22} />
        </Pressable>
      </View>

      <View style={styles.scrollViewContainer}>
        <ScrollView style={styles.root} contentContainerStyle={styles.content}>
          <Image
            source={require('../../assets/react.png')}
            style={styles.logo}
          />

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
                onChangeText={text => onChangeText(text, 'email')}
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
                onChangeText={text => onChangeText(text, 'username')}
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
              secureTextEntry={isHiddenPassword}
              onChangeText={text => onChangeText(text, 'password')}
              autoCapitalize={'none'}
            />
            <Pressable onPress={toggleIsSecure} hitSlop={40}>
              <Icon
                name={isHiddenPassword ? 'eye' : 'eye-off'}
                size={22}
                color={'#9E9EA7'}
              />
            </Pressable>
          </View>
          {fieldErrors.password && (
            <Text style={styles.error}>{fieldErrors.password}</Text>
          )}

          <View style={styles.textInputContainer}>
            <Icon
              name={'ios-lock-closed'}
              size={22}
              color={'#9E9EA7'}
              style={styles.icon}
            />
            <TextInput
              style={styles.textInput}
              placeholder={'Confirm your password'}
              secureTextEntry={isHiddentConfirmation}
              onChangeText={text => onChangeText(text, 'confirmation')}
              autoCapitalize={'none'}
            />
            <Pressable
              onPress={() => setIsHiddentConfirmation(s => !s)}
              hitSlop={40}>
              <Icon
                name={isHiddentConfirmation ? 'eye' : 'eye-off'}
                size={22}
                color={'#9E9EA7'}
              />
            </Pressable>
          </View>
          {fieldErrors.confirmation && (
            <Text style={styles.error}>{fieldErrors.confirmation}</Text>
          )}

          <View style={styles.buttonContainer}>
            <Text style={styles.joined}>
              By signing up, you're agree to{' '}
              <Text style={styles.login}>terms and conditions</Text> and our{' '}
              <Text style={styles.login}>privicy policy.</Text>
            </Text>

            <Button
              action={'accept'}
              text="Confirm"
              disabled={
                isValidating ||
                ((fieldErrors.username ||
                  fieldErrors.email ||
                  fieldErrors.password ||
                  fieldErrors.confirmation) as unknown as boolean)
              }
              width={width * 0.9}
              onPress={validateAccountDetails}
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
      </View>

      {hasPermission ? (
        <ImagePicker translateY={translateY} onCrop={() => {}} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingBottom: statusBarHeight,
    paddingHorizontal: width * 0.05,
  },
  topbar: {
    width: '100%',
    height: statusBarHeight * 2,
    paddingHorizontal: SPACING,
    justifyContent: 'center',
  },
  logo: {
    width: IMAGE_SIZE - 10,
    height: IMAGE_SIZE - 10,
    marginVertical: SPACING,
    alignSelf: 'center',
  },
  signUp: {
    fontFamily: 'UberBold',
    color: '#000',
    fontSize: 22,
    marginBottom: 10,
  },
  textInputContainer: {
    height: 44,
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
    marginVertical: 16,
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
