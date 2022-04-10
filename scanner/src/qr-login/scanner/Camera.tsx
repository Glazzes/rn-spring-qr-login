import {AppState, Dimensions} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Camera as VCamera, useCameraDevices} from 'react-native-vision-camera';
import {View} from 'react-native';
import {BarcodeFormat, useScanBarcodes} from 'vision-camera-code-scanner';
import emitter from '../../utils/emitter';

const {width, height} = Dimensions.get('window');

const Camera: React.FC = () => {
  const [scanned, setScanned] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(true);
  const [inForeGround, setInForeground] = useState<boolean>(true);
  const devices = useCameraDevices();
  const device = devices.back;

  const [frameProcessor, codes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  useEffect(() => {
    if (codes[0] !== undefined && !scanned) {
      setScanned(prev => !prev);
      emitter.emit('play.animation', {});
    }

    const subscription = AppState.addEventListener('change', state => {
      setInForeground(state === 'active');
    });

    return () => {
      subscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codes]);

  if (device == null) return <View />;

  return (
    <VCamera
      device={device}
      frameProcessor={frameProcessor}
      frameProcessorFps={1}
      isActive={active && inForeGround}
      style={{width, height}}
    />
  );
};

export default Camera;
