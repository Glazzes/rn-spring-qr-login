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
} from "react-native";
import React, {useEffect, useRef, useState} from "react";
import {browserName, browserVersion, osName, osVersion} from "react-device-detect";
import {QRCodeSVG} from "qrcode.react";
import {v4 as uuid} from "uuid";
import axios from "axios";
import {QrCode, User} from "../../utils/types";
import {deleteEventUrl, getEventSourceUrl, qrLogin} from "../../utils/urls";
import {SIZE} from "../../utils/contants";
import {setAccessToken} from "../../utils/authStore";
import {Events} from "../../utils/enums";
import { COUNNTDOWN_SECONDS } from "../utils/constants";

const deviceId = uuid();

const EMPTY_USER = {
  id: "", 
  username: "", 
  profilePicture: "",
}

const QrCodeLogin: React.FC = () => {
  const [displayCode, setDisplayCode] = useState<boolean>(false);
  const [user, setUser] = useState<User>(EMPTY_USER);
  const [textTime, setTextTime] = useState<string>("10:00");
  const [time, setTime] = useState<number>(0);
  const [countdown, setCountdown] = useState<NodeJS.Timer | undefined>();

  const [eventSource, setEventSource] = useState(() => {
    const url = getEventSourceUrl(deviceId);
    return new EventSource(url);
  });

  const [qrCode, setQrCode] = useState<QrCode>(() => {
    const os = `${osName}${osVersion === "none" ? "" : " " + osVersion}`;
    const deviceName = `${browserName} ${browserVersion}`;

    return {
      issuedFor: "",
      mobileId: "",
      deviceId,
      deviceName,
      ipAddress: "",
      location: "",
      os
    }
  });

  const translateX = useRef(new Animated.Value(-1 * SIZE)).current;
  const translateContainer = (toValue: number) => {
    Animated.timing(translateX, {toValue, duration: 300, useNativeDriver: false}).start();
  };

  const displayCurrentUser = (e: {data: string}) => {
    const user = JSON.parse(e.data) as User;
    setUser(user);
    setQrCode((qr) => ({...qr, issuedFor: user.id, mobileId: "some-mobile-id"}));
    translateContainer(-SIZE);

    setCountdown(() => {
      return setInterval(() => setTime(t => t + 1), 1000);
    });
  }

  const login = () => {
    axios
      .post(qrLogin, qrCode)
      .then((res) => {
        const token = res.headers["authorization"];
        if (token) {
          setAccessToken(token);
        } else {
          Alert.alert("Login successfull but no access token was present");
        }
      })
      .catch((e) => console.log(e.response));
  }

  const setToBaseState = () => {
    const newId = uuid();

    setUser(EMPTY_USER);
    setDisplayCode(false);
    translateContainer(0);
    setQrCode(qr => ({...qr, deviceId: newId, issuedFor: "", mobileId: ""}));

    if(countdown) {
      clearInterval(countdown);
    }
    setCountdown(undefined);
    setTime(0);
    setTextTime("10:00");

    const newUrl = getEventSourceUrl(deviceId);
    setEventSource(new EventSource(newUrl));

    translateContainer(0);
  }

  const deleteEvetSoruce = async () => {
    const res = await fetch(deleteEventUrl(qrCode.deviceId), {method: "DELETE"});
    if (res.status === 204) {
           console.log("source deleted");
      return;
    }

    if (res.status === 404) {
      console.log("source not found");
      return;
    }
  };

  useEffect(() => {
    eventSource.addEventListener(Events.DISPLAY_USER, displayCurrentUser);
    eventSource.addEventListener(Events.LOGIN_PERFORM, login);
    eventSource.addEventListener(Events.LOGIN_CANCEL, setToBaseState);

    return () => {
      eventSource.removeEventListener(Events.DISPLAY_USER, displayCurrentUser);
      eventSource.removeEventListener(Events.LOGIN_PERFORM, login);
      eventSource.removeEventListener(Events.LOGIN_CANCEL, setToBaseState);
      eventSource.close();
    }
  }, [eventSource]);

  useEffect(() => {
    const actualTime = COUNNTDOWN_SECONDS - time;
    const minutes = Math.floor(actualTime / 60);
    const seconds = actualTime % 60;

    setTextTime(`${minutes}: ${seconds >= 10 ? seconds : "0" + seconds}`);

    if(actualTime <= 0) {
      setToBaseState();
    }

  }, [time, countdown]);

  useEffect(() => {
    axios
      .get("https://freeipapi.com/api/json")
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
            <View>
                <Text>{time}</Text>
                <QRCodeSVG
                value={JSON.stringify(qrCode)}
                size={SIZE - 30}
                includeMargin={true}
                fgColor={"#2C3639"}
              />
            </View>
          ) : (
            <View style={styles.placeHolder}>
              <ActivityIndicator color={"#2C3639"} size={50} />
            </View>
          )}
          <Text style={[styles.text, {marginTop: 10}]}>Scan this qr with our mobile app to login!</Text>
        </View>

        <View style={styles.infoContainer}>
          <Image
            source={{
              uri: 'https://www.purina.co.uk/sites/default/files/styles/square_medium_440x440/public/2022-07/Dalmatian1.jpg?h=d8db1d25&itok=f_I43-vM',
            }}
            resizeMode={"cover"}
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
    overflow: "hidden",
  },
  root: {
    height: SIZE,
    width: SIZE * 2,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  qrContainer: {
    height: SIZE,
    width: SIZE,
    alignItems: "center",
  },
  placeHolder: {
    height: SIZE - 30,
    width: SIZE - 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    borderRadius: 10,
  },
  qrCode: {
    height: SIZE,
    width: SIZE,
  },
  text: {
    color: "#2C3639",
    fontWeight: "bold",
    fontSize: 15,
  },
  infoContainer: {
    width: SIZE,
    height: SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  picture: {
    height: SIZE / 2,
    width: SIZE / 2,
    borderRadius: SIZE / 4,
    marginBottom: 20,
  },
  username: {
    color: "#E94560",
    fontWeight: "bold",
    fontSize: 15,
    textTransform: "capitalize",
  },
  button: {
    padding: 10,
    backgroundColor: "#E94560",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
  },
  margin: {
    marginVertical: 5,
  }
});

export default QrCodeLogin;
