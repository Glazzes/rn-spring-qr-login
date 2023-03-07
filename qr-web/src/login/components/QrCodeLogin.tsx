/* eslint-disable react/no-unescaped-entities */
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Pressable,
  Animated,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {browserName, browserVersion, osName, osVersion} from 'react-device-detect';
import {QRCodeSVG} from 'qrcode.react';
import {v4 as uuid} from 'uuid';
import axios from 'axios';
import {DisplayUserEventDTO, QrCode, User} from '../../utils/types';
import {getEventSourceUrl, getProfilePictureUrl, qrLogin} from '../../utils/urls';
import {SIZE} from '../../utils/contants';
import {setAccessToken} from '../../utils/authStore';
import {Events} from '../../utils/enums';
import { COUNNTDOWN_SECONDS } from '../utils/constants';

const deviceId = uuid();

const EMPTY_USER = {
  id: '', 
  username: '', 
  profilePicture: '',
}

const QrCodeLogin: React.FC = () => {
  const elapsedTime = useRef<number>(0);

  const [displayCode, setDisplayCode] = useState<boolean>(true);
  const [user, setUser] = useState<User>(EMPTY_USER);
  const [textTime, setTextTime] = useState<string>('10:00');

  const [eventSource, setEventSource] = useState(() => {
    const url = getEventSourceUrl(deviceId);
    return new EventSource(url);
  });

  const [qrCode, setQrCode] = useState<QrCode>(() => {
    const os = `${osName}${osVersion === 'none' ? '' : ' ' + osVersion}`;
    const deviceName = `${browserName} ${browserVersion}`;

    return {
      issuedFor: '',
      mobileId: '',
      deviceId,
      deviceName,
      ipAddress: '',
      location: '',
      os
    }
  });

  const translateX = useRef(new Animated.Value(0)).current;
  const translateContainer = (toValue: number) => {
    Animated.timing(translateX, {toValue, duration: 300, useNativeDriver: false}).start();
  };

  const displayCurrentUser = (e: {data: string}) => {
    const {user, mobileId} = JSON.parse(e.data) as DisplayUserEventDTO;
    user.profilePicture = getProfilePictureUrl(user.profilePicture);
    setUser(user);
    setQrCode((qr) => ({...qr, issuedFor: user.id, mobileId}));
    translateContainer(-1 * SIZE);

    const interval = setInterval(() => {
      elapsedTime.current += 1;
      if(elapsedTime.current > COUNNTDOWN_SECONDS) {
        elapsedTime.current = 0;
        clearInterval(interval)
        setToBaseState();
        return;
      }

      const acutalTime = COUNNTDOWN_SECONDS - elapsedTime.current;
      const minutes = Math.floor(acutalTime / 60);
      const seconds = acutalTime % 60;

      setTextTime(`${minutes}: ${seconds > 9 ? seconds : '0' + seconds}`)
    }, 1000)
  }

  const login = useCallback(() => {
    axios
      .post(qrLogin, qrCode)
      .then(response => {
        const token = response.headers['authorization'];
        if (token) {
          setAccessToken(token);
        } else {
          Alert.alert('Login successfull but no access token was present');
        }
      })
      .catch((e) => console.log(e, 'fail'));
  }, [qrCode])

  const setToBaseState = () => {
    const newId = uuid();

    setDisplayCode(false);
    setUser(EMPTY_USER);
    translateContainer(0);
    setQrCode(qr => ({...qr, deviceId: newId, issuedFor: '', mobileId: ''}));
    setTextTime('10:00');
    elapsedTime.current = 0;

    const newUrl = getEventSourceUrl(newId);
    setEventSource(new EventSource(newUrl));

    translateContainer(0);

    const timeout = setTimeout(() => {
      setDisplayCode(true);
      clearTimeout(timeout);
    }, 1000)
  }

  useEffect(() => {
    eventSource.addEventListener(Events.DISPLAY_USER, displayCurrentUser);
    eventSource.addEventListener(Events.PERFORM_LOGIN, login);
    eventSource.addEventListener(Events.CANCEL_LOGIN, setToBaseState);

    return () => {
      eventSource.removeEventListener(Events.DISPLAY_USER, displayCurrentUser);
      eventSource.removeEventListener(Events.PERFORM_LOGIN, login);
      eventSource.removeEventListener(Events.CANCEL_LOGIN, setToBaseState);
    }
  }, [eventSource, login]);

  useEffect(() => {
    axios
      .get('https://freeipapi.com/api/json')
      .then(({data}) => {
        setQrCode((qr) => ({
          ...qr,
          ipAddress: data.ipAddress,
          location: `${data.cityName}, ${data.countryName}`,
        }));

        setDisplayCode(true);
      })
      .catch((e) => console.log(e));
  }, []);

  return (
    <View style={styles.topContainer}>
      <Animated.View style={[styles.root, {transform: [{translateX}]}]}>
        <View style={styles.qrContainer}>
          {displayCode ? (
            <QRCodeSVG
              value={JSON.stringify(qrCode)}
              size={SIZE - 30}
              includeMargin={true}
              fgColor={'#2C3639'}
              imageSettings={{
                src: require('../../../assets/react.png'),
                height: 60,
                width: 60,
                excavate: false
              }}
            />
          ) : (
            <View style={styles.placeHolder}>
              <ActivityIndicator color={'#2C3639'} size={50} />
            </View>
          )}
          <Text style={[styles.text, {marginTop: 10}]}>Scan this qr with our mobile app to login!</Text>
        </View>

        <View style={styles.infoContainer}>
          <Image
            source={{uri: user.profilePicture}}
            resizeMode={'cover'}
            style={styles.picture}
          />
          <Text style={styles.text}>
            You're logging in as <Text style={styles.username}>{user.username}</Text>
          </Text>
          <Text style={[styles.text, styles.margin]}>{textTime}</Text>
          <Pressable
            style={styles.button}
            onPress={setToBaseState}>
            <Text style={styles.buttonText}>This is not me</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    height: SIZE,
    width: SIZE,
    overflow: 'hidden',
  },
  root: {
    height: SIZE,
    width: SIZE * 2,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  qrContainer: {
    height: SIZE,
    width: SIZE,
    alignItems: 'center',
  },
  placeHolder: {
    height: SIZE - 30,
    width: SIZE - 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    borderRadius: 10,
  },
  qrCode: {
    height: SIZE,
    width: SIZE,
  },
  text: {
    color: '#2C3639',
    fontWeight: 'bold',
    fontSize: 15,
  },
  infoContainer: {
    width: SIZE,
    height: SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  picture: {
    height: SIZE / 2,
    width: SIZE / 2,
    borderRadius: SIZE / 4,
    marginBottom: 20,
  },
  username: {
    color: '#E94560',
    fontWeight: 'bold',
    fontSize: 15,
    textTransform: 'capitalize',
  },
  button: {
    padding: 10,
    backgroundColor: '#E94560',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
  },
  margin: {
    marginVertical: 5,
  }
});

export default QrCodeLogin;
