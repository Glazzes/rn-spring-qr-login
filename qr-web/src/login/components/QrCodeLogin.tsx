/* eslint-disable react/no-unescaped-entities */
import React, {useEffect, useRef, useState} from 'react';
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
  const [textTime, setTextTime] = useState<string>('5:00');

  const [timeInvertal, setTimeInterval] = useState<number>();
  const [countdownInterval, setCountdownInterval] = useState<number>();

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

  const assignTimeInterval = () => {
    if(timeInvertal) {
      clearInterval(timeInvertal);
    }

    const interval = setInterval(() => {
      setToBaseState();
    }, COUNNTDOWN_SECONDS * 1000);

    setTimeInterval(interval);
  }

  const displayCurrentUser = (e: {data: string}) => {
    const {user, mobileId} = JSON.parse(e.data) as DisplayUserEventDTO;
    user.profilePicture = getProfilePictureUrl(user.profilePicture);

    setUser(user);
    setQrCode((qr) => ({...qr, issuedFor: user.id, mobileId}));
    translateContainer(-1 * SIZE);

    if(countdownInterval) {
      clearInterval(countdownInterval);
    }

    elapsedTime.current = 0;
    setCountdownInterval(() => {
      const interval = setInterval(() => {
        elapsedTime.current++;
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
    });
  }

  const setToBaseState = async () => {
    if(countdownInterval) {
      clearInterval(countdownInterval);
    }

    elapsedTime.current = 0;
    assignTimeInterval();
    setCountdownInterval(undefined);

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

  const login = () => {
    axiosInstance
      .post(qrLogin, qrCode)
      .then(response => {
        const accessToken = response.headers['authorization'];
        const refreshToken = response.headers['refresh-token'];
 
        if (accessToken && refreshToken) {
          localStorage.setItem('tokens', JSON.stringify({accessToken, refreshToken}));
          setAccessToken(accessToken);
          setIsAuthenticated(true);
        } else {
          Alert.alert('Login successfull but no access token was present');
        }
      })
      .catch((e) => console.log(e, 'fail'));
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
    assignTimeInterval();
  }, [])

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
    <View style={styles.root}>
      <Animated.View style={[styles.animationContainer, {transform: [{translateX}]}]}>
        <View style={styles.container}>
          <Text style={styles.title}>Scan QR Code</Text>
          <Text style={styles.subtitle}>Scan this QR code with the mobile app to login!</Text>
          {displayCode ? (
              <View style={styles.qrWrapper}>
                <QRCodeSVG
                value={JSON.stringify(qrCode)}
                size={200 - 8}
                includeMargin={false}
                fgColor={'#2C3639'}
                imageSettings={{
                  src: require('../../../assets/react.png'),
                  height: 60,
                  width: 60,
                  excavate: false
                }}
              />
              </View>
            ): null}
        </View>

        <View style={styles.container}>
          <Image
              source={{uri: user.profilePicture}}
              resizeMode={'cover'}
              style={styles.picture}
            />
            <Text style={styles.text}>
              You're logging in as <Text style={styles.username}>{user.username}</Text>
            </Text>
            <Text style={[styles.text, styles.margin]}>{textTime}</Text>
            <Button action={'decline'} text={'This is not me'} onPress={setToBaseState} width={SIZE * 0.8} />
          </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: SIZE,
    overflow: "hidden"
  },
  animationContainer: {
    width: SIZE * 2,
    flexDirection: "row",
  },
  container: {
    height: SIZE,
    width: SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: "ExtraBold",
    color: "#000",
    fontSize: 20
  },
  subtitle: {
    fontFamily: "SemiBold",
    textAlign: "center",
    marginBottom: 16,
    maxWidth: 200,
    color: "#475569",
  },
  qrWrapper: {
    height: 200,
    width: 200,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    shadowColor: "rgba(0, 0, 0, 0.5)",
    shadowOpacity: 1,
    shadowRadius: 1,
  },
  placeHolder: {
    height: SIZE - 30,
    width: SIZE - 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    borderRadius: 10,
  },
  text: {
    color: '#475569',
    fontFamily: "SemiBold",
    fontSize: 15,
  },
  infoContainer: {
    width: SIZE,
    height: SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  picture: {
    height: SIZE / 2.5,
    width: SIZE / 2.5,
    borderRadius: SIZE / 4,
    marginBottom: 16,
  },
  username: {
    color: '#ff5e5e',
    fontFamily: "SemiBold",
    fontSize: 15,
    textTransform: 'capitalize',
  },
  margin: {
    marginVertical: 5,
  }
});

export default QrCodeLogin;
