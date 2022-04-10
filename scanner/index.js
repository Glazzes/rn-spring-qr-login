import 'react-native-reanimated';
import {Navigation} from 'react-native-navigation';

import {Screens} from './src/utils/screens';
import {Home} from './src/home';
import {
  Scanner,
  ScanWarning,
  PostScanInformation,
  DeviceInformation,
} from './src/qr-login';

Navigation.registerComponent(Screens.HOME, () => Home);
Navigation.registerComponent(Screens.WARNING, () => ScanWarning);
Navigation.registerComponent(Screens.SCANNER, () => Scanner);
Navigation.registerComponent(Screens.DEVICE_FOUND, () => DeviceInformation);
Navigation.registerComponent(Screens.POST_SCAN, () => PostScanInformation);

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        id: Screens.STACK,
        options: {
          topBar: {
            visible: false,
          },
        },
        children: [
          {
            component: {
              name: Screens.HOME,
            },
          },
        ],
      },
    },
  });
});
