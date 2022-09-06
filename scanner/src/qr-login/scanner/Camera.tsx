import {AppState, Dimensions, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Camera as VCamera, useCameraDevices} from 'react-native-vision-camera';
import {BarcodeFormat, useScanBarcodes} from 'vision-camera-code-scanner';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {StackScreens} from '../../navigation/stackScreens';
import {QrCode} from '../../utils/types';

const {width, height} = Dimensions.get('window');

const Camera: React.FC = () => {
  const navigation = useNavigation<NavigationProp<StackScreens, 'Scanner'>>();

  const [scanned, setScanned] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(true);
  const [inForeGround, setInForeground] = useState<boolean>(true);
  const devices = useCameraDevices();

  const [frameProcessor, codes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  useEffect(() => {
    if (codes[0] !== undefined && !scanned) {
      try {
        const result: QrCode = JSON.parse(codes[0].content.data as string);
        navigation.navigate('DeviceInformation', {
          ipAddress: result.ipAddress,
          location: result.location,
          device: `${result.os}, ${result.deviceName}`,
        });
      } catch (e) {
        Alert.alert('This is not one of our qr codes');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codes]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      setInForeground(state === 'active');
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
      isActive={active && inForeGround}
      style={{width, height}}
    />
  );
};

export default Camera;
