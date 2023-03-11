import {AppState, Dimensions, StatusBar, StyleSheet} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {Camera as VCamera, useCameraDevices} from 'react-native-vision-camera';
import {BarcodeFormat, useScanBarcodes} from 'vision-camera-code-scanner';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {QrCode, StackScreens} from '../../utils/types';
import {apiSaveQRCodeUrl, displayUserEventUrl} from '../../utils/urls';
import {axiosInstance} from '../../utils/axiosInstance';
import uuid from 'react-native-uuid';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import {View} from 'native-base';
import Toast from '../../misc/Toast';
import {
  INVALID_CODE_ERROR,
  PROCESSING_CODE_INFO,
  SERVER_ERROR,
  SIGNED_CODE_ERROR,
} from '../utils/constants';
import {AxiosError} from 'axios';
import {ScanStatus} from '../utils/types';
import CameraWrapper from './CameraWrapper';

const {width, height} = Dimensions.get('window');

const Scanner: React.FC = () => {
  const selector = useSelector((state: RootState) => state);
  const navigation = useNavigation<NavigationProp<StackScreens, 'Scanner'>>();

  const isScanning = useRef<boolean>(false);
  const [active, setActive] = useState<boolean>(true);
  const [scanStatus, setScanStatus] = useState<ScanStatus | undefined>();

  const devices = useCameraDevices();
  const [frameProcessor, codes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  const resetScanStats = () => {
    setScanStatus(undefined);
    isScanning.current = false;
  };

  const saveQrCode = async (qrCode: QrCode) => {
    setScanStatus(PROCESSING_CODE_INFO);
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
      console.log((e as AxiosError).response);
    } finally {
      isScanning.current = false;
    }
  };

  useEffect(() => {
    if (codes[0] !== undefined && !isScanning.current) {
      isScanning.current = true;
      try {
        // @ts-ignore
        let qrCode;
        try {
          qrCode = JSON.parse(codes[0].content.data as string);
        } catch (e) {
          setScanStatus(INVALID_CODE_ERROR);
          return;
        }

        if (qrCode.issuedFor !== '' || qrCode.mobileId !== '') {
          setScanStatus(SIGNED_CODE_ERROR);
          return;
        }

        const mobileId = uuid.v4();
        qrCode.issuedFor = selector.auth.user.id;
        qrCode.mobileId = mobileId;

        saveQrCode(qrCode);
      } catch (e) {
        const response = (e as AxiosError).response;
        if (response?.status === 500) {
          setScanStatus(SERVER_ERROR);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codes, scanStatus]);

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
    <View style={styles.root}>
      <StatusBar backgroundColor={'#000'} />
      <CameraWrapper>
        <VCamera
          device={devices.back}
          frameProcessor={frameProcessor}
          frameProcessorFps={1}
          isActive={active}
          style={{width, height}}
        />
      </CameraWrapper>
      {scanStatus ? (
        <Toast {...scanStatus} onAnimationEnd={resetScanStats} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Scanner;
