import {View, Text, StyleSheet, ActivityIndicator, Image, Pressable, Animated} from "react-native";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {QrCode, User} from "../utils/types";
import {browserName, browserVersion, osName, osVersion} from "react-device-detect";
import {QRCodeSVG} from "qrcode.react";

// @ts-ignore
import {v4 as uuid} from "uuid";
import {SIZE} from "../utils/contants";
import axios from "axios";
import {SourceEvents} from "../utils/enums";
import {getEventSourceUrl, qrLogin} from "../utils/urls";

type QrCodeLoginProps = {};

const QrCodeLogin: React.FC<QrCodeLoginProps> = ({}) => {
  const translateX = useRef(new Animated.Value(0)).current;

  const [showQr, setShowQr] = useState<boolean>(false);
  const [user, setUser] = useState<User>({id: "", username: "", profilePicture: ""});

  const [qrCode, setQrCode] = useState<QrCode>({
    issuedFor: "",
    mobileId: "",
    deviceId: uuid(),
    deviceName: `${browserName} ${browserVersion}`,
    ipAddress: "",
    location: "",
    os: `${osName}${osVersion === "none" ? "" : " " + osVersion}`,
  });

  const [interval, setIntv] = useState<NodeJS.Timer>(setInterval(() => reset(), 600 * 1000));

  const eventSource = useMemo(() => {
    return new EventSource(getEventSourceUrl(qrCode.deviceId));
  }, [qrCode.deviceId]);

  const reset = () => {
    setShowQr(false);
    animateContainer(0);
    setQrCode((qr) => ({...qr, deviceId: uuid(), mobileId: "", issuedFor: ""}));
    setUser({id: "", username: "", profilePicture: ""});
    eventSource.close();

    const tout = setTimeout(() => {
      setShowQr(true);
      clearTimeout(tout);
    }, 5000);
  };

  const resetAndClearInterval = () => {
    clearInterval(interval);
    reset();
    setIntv(setInterval(() => reset(), 600 * 1000));
  };

  const animateContainer = (toValue: number) => {
    Animated.timing(translateX, {toValue, duration: 500, useNativeDriver: false}).start();
  };

  useEffect(() => {
    axios
      .get("https://freeipapi.com/api/json")
      .then(({data}) => {
        setQrCode((qr) => ({
          ...qr,
          ipAddress: data.ipAddress,
          location: `${data.cityName}, ${data.countryName}`,
        }));

        setShowQr(true);
      })
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    // @ts-ignore
    const userShow = (e) => {
      const user = JSON.parse(e.data) as User;
      setUser(user);
      setQrCode((qr) => ({...qr, issuedFor: user.id, mobileId: "some-mobile-id"}));
      animateContainer(-SIZE);
    };

    const login = () => {
      // there's no way to obtain the current qr code but using a set state function
      setQrCode((qr) => {
        fetch(qrLogin, {method: "POST", body: JSON.stringify(qr)}).then(() =>
          console.log("successful login"),
        );

        return qr;
      });
    };

    eventSource.addEventListener(SourceEvents.USER_SHOW, userShow);
    eventSource.addEventListener(SourceEvents.LOGIN_PERFORM, login);
    eventSource.addEventListener(SourceEvents.LOGIN_CANCEL, resetAndClearInterval);

    return () => {
      eventSource.removeEventListener(SourceEvents.USER_SHOW, userShow);
      eventSource.removeEventListener(SourceEvents.LOGIN_PERFORM, login);
      eventSource.removeEventListener(SourceEvents.LOGIN_CANCEL, resetAndClearInterval);
      eventSource.close();

      clearInterval(interval);
    };
  }, [eventSource]);

  return (
    <View style={styles.topContainer}>
      <Animated.View style={[styles.root, {transform: [{translateX}]}]}>
        <View style={styles.qrContainer}>
          {showQr ? (
            <QRCodeSVG
              value={JSON.stringify(qrCode)}
              size={SIZE - 30}
              includeMargin={true}
              fgColor={"#2C3639"}
            />
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
              uri: user.profilePicture,
            }}
            resizeMode={"cover"}
            style={styles.picture}
          />
          <Text style={styles.text}>
            You're logging in as <Text style={styles.username}>{user.username}</Text>
          </Text>
          <Pressable
            style={styles.button}
            onPress={() => {
              animateContainer(0);
              resetAndClearInterval();
            }}>
            <Text style={styles.buttonText}>This not me</Text>
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
  },
  button: {
    padding: 10,
    backgroundColor: "#E94560",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
  },
});

export default QrCodeLogin;
