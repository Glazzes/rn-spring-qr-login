import {AppState, Dimensions, Alert} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {Camera as VCamera, useCameraDevices} from 'react-native-vision-camera';
import {BarcodeFormat, useScanBarcodes} from 'vision-camera-code-scanner';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {StackScreens} from '../navigation/stackScreens';
import {QrCode} from '../utils/types';
import {apiSaveQRCodeUrl, displayUserEventUrl} from '../utils/urls';
import {axiosInstance} from '../utils/axiosInstance';
import uuid from 'react-native-uuid';
import {useSelector} from 'react-redux';
import {RootState} from '../store/store';

const {width, height} = Dimensions.get('window');

const Camera: React.FC = () => {
  const selector = useSelector((state: RootState) => state);
  const navigation = useNavigation<NavigationProp<StackScreens, 'Scanner'>>();

  const scanning = useRef(false);
  const [active, setActive] = useState<boolean>(true);
  const devices = useCameraDevices();

  const [frameProcessor, codes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  const saveQrCode = async (qrCode: QrCode) => {
    try {
      await axiosInstance.post(apiSaveQRCodeUrl, qrCode);

      const url = displayUserEventUrl(qrCode.deviceId);
      await axiosInstance.post(url, undefined, {
        params: {
          mobileId: qrCode.mobileId,
        },
      });

      navigation.navigate('DeviceInformation', {
        ipAddress: qrCode.ipAddress,
        location: qrCode.location,
        device: `${qrCode.os}, ${qrCode.deviceName}`,
        id: qrCode.deviceId,
        qrCode,
      });
    } catch (e) {
      console.log(e);
    } finally {
      scanning.current = false;
    }
  };

  useEffect(() => {
    if (codes[0] !== undefined && !scanning.current) {
      scanning.current = true;
      try {
        // @ts-ignore
        const qrCode = JSON.parse(codes[0].content.data);

        if (qrCode.issuedFor !== '' || qrCode.mobileId !== '') {
          Alert.alert('This code is already signed, reload the web page');
          return;
        }

        const mobileId = uuid.v4();
        qrCode.issuedFor = selector.auth.user.id;
        qrCode.mobileId = mobileId;

        saveQrCode(qrCode);
      } catch (e) {
        console.log(e);

        Alert.alert(
          'The code you just scanned is not a code accepted by this app',
        );
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
