/* eslint-disable react/no-unescaped-entities */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Animated,
  Alert,
} from 'react-native';
import {browserName, browserVersion, osName, osVersion} from 'react-device-detect';
import {QRCodeSVG} from 'qrcode.react';
import {v4 as uuid} from 'uuid';
import axios, {AxiosError} from 'axios';
import {DisplayUserEventDTO, QrCode, User} from '../../utils/types';
import {deleteSourceUrl, getEventSourceUrl, getProfilePictureUrl, qrLogin} from '../../utils/urls';
import {SIZE} from '../../utils/contants';
import {setAccessToken, setIsAuthenticated} from '../../utils/authStore';
import {Events} from '../../utils/enums';
import {COUNNTDOWN_SECONDS} from '../utils/constants';
import {axiosInstance} from '../../utils/axiosInstace';
import Button from '../../shared/Button';

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
  const [timeInterval, setTimeInterval] = useState<number>();

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

    setTimeInterval(() => {
      const interval = () => setInterval(() => {
        elapsedTime.current += 1;
        if(elapsedTime.current >= COUNNTDOWN_SECONDS) {
          setToBaseState();
          return;
        }
  
        const acutalTime = COUNNTDOWN_SECONDS - elapsedTime.current;
        const minutes = Math.floor(acutalTime / 60);
        const seconds = acutalTime % 60;
  
        setTextTime(`${minutes}: ${seconds > 9 ? seconds : '0' + seconds}`)
      }, 1000)

      return interval;
    })
  }

  const login = useCallback(() => {
    axiosInstance
      .post(qrLogin, qrCode)
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
      .catch((e) => console.log(e, 'fail'));
  }, [qrCode])

  const setToBaseState = async () => {
    if(timeInterval) {
      clearInterval(timeInterval);
    }

    elapsedTime.current = 0;

    try{
      const url = deleteSourceUrl(qrCode.deviceId);
      await axiosInstance.delete(url)

      const newId = uuid();

      setDisplayCode(false);
      setUser(EMPTY_USER);
      translateContainer(0);
      setQrCode(qr => ({...qr, deviceId: newId, issuedFor: '', mobileId: ''}));
      setTextTime('10:00');
      
      setEventSource(prev => {
        prev.close();
        const newUrl = getEventSourceUrl(newId);
        return new EventSource(newUrl)
      });

      translateContainer(0);

      const timeout = setTimeout(() => {
        setDisplayCode(true);
        clearTimeout(timeout);
      }, 1000)

    }catch(e) {
      console.log((e as AxiosError).response)
    }
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
      .get('https://ipapi.co/json/')
      .then(({data}) => {
        setQrCode((qr) => ({
          ...qr,
          ipAddress: data.ip,
          location: `${data.city}, ${data.country_name}`,
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
          <Button action={'decline'} text={'This is not me'} onPress={setToBaseState} width={SIZE} />
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
  margin: {
    marginVertical: 5,
  }
});

export default QrCodeLogin;
