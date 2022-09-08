import {AppState, Dimensions, Alert} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {Camera as VCamera, useCameraDevices} from 'react-native-vision-camera';
import {BarcodeFormat, useScanBarcodes} from 'vision-camera-code-scanner';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {StackScreens} from '../navigation/stackScreens';
import {QrCode} from '../utils/types';
import {useSnapshot} from 'valtio';
import {authState} from '../store/authStore';
import axios from 'axios';
import {saveQrCodeUrl, userShowEventUrl} from '../utils/urls';

const {width, height} = Dimensions.get('window');

const Camera: React.FC = () => {
  const state = useSnapshot(authState);
  const navigation = useNavigation<NavigationProp<StackScreens, 'Scanner'>>();

  const scanning = useRef(false);
  const [active, setActive] = useState<boolean>(true);
  const devices = useCameraDevices();

  const [frameProcessor, codes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  const saveQrCode = async (qrCode: QrCode) => {
    try {
      const headers = {Authorization: state.accessToken};
      const {data} = await axios.post(saveQrCodeUrl, qrCode, {headers});
      console.log(data);

      await axios.post(userShowEventUrl(qrCode.deviceId), undefined, {
        headers,
      });

      navigation.navigate('DeviceInformation', {
        ipAddress: qrCode.ipAddress,
        location: qrCode.location,
        device: `${qrCode.os}, ${qrCode.deviceName}`,
        id: qrCode.deviceId,
        qrCode,
      });
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    if (codes[0] !== undefined && !scanning.current) {
      scanning.current = true;
      try {
        const qrCode: QrCode = JSON.parse(codes[0].content.data as string);
        if (qrCode.issuedFor !== '' || qrCode.mobileId !== '') {
          Alert.alert('This code is already signed, reload the we page');
          return;
        }

        qrCode.issuedFor = state.user.id;
        qrCode.mobileId = 'some-mobile-id';

        console.log(qrCode);

        saveQrCode(qrCode);
      } catch (e) {
        Alert.alert('This is not one of our qr codes');
      } finally {
        scanning.current = false;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codes]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      setActive(state === 'active');
    });

    return () => {
      subscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (devices.back == null) {
    return null;
  }

  return (
    <VCamera
      device={devices.back}
      frameProcessor={frameProcessor}
      frameProcessorFps={1}
      isActive={active}
      style={{width, height}}
    />
  );
};

export default Camera;
