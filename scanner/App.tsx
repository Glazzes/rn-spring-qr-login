import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Home} from './src/home';
import {StackScreens} from './src/navigation/stackScreens';
import {NativeBaseProvider} from 'native-base';
import {DeviceInformation, PostScanInformation} from './src/post-scan';
import {Scanner} from './src/scanner';
import ScanWarning from './src/other/ScanWarning';
import {CreateAccount, Login} from './src/onboarding';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import {CropEditor} from './src/crop_editor';
import {Provider, useSelector} from 'react-redux';
import {RootState, store} from './src/store/store';
import {loadAsync} from 'expo-font';

// LogBox.ignoreLogs(['[react-native-gesture-handler]']);

const Stack = createSharedElementStackNavigator<StackScreens>();

const App: React.FC = () => {
  // const snap = useSnapshot(authState);
  const [isFontloaded, setIsFontLoaded] = useState<boolean>(false);
  const selector = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // @ts-ignore
    loadAsync('UberBold', require('./src/assets/fonts/UberBold.otf')).finally(
      () => setIsFontLoaded(true),
    );
  }, []);

  if (!isFontloaded) {
    return null;
  }

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        {selector.isAuthenticated ? (
          <Stack.Navigator
            initialRouteName={'Home'}
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name={'Home'} component={Home} />
            <Stack.Screen name={'Warning'} component={ScanWarning} />
            <Stack.Screen name={'Scanner'} component={Scanner} />

            <Stack.Screen
              name={'DeviceInformation'}
              component={DeviceInformation}
            />

            <Stack.Screen name={'ScanResult'} component={PostScanInformation} />
          </Stack.Navigator>
        ) : (
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen
              name={'Login'}
              component={Login}
              initialParams={{createdAccount: false}}
            />
            <Stack.Screen name={'CreateAccount'} component={CreateAccount} />
            <Stack.Screen
              name={'CropEditor'}
              component={CropEditor}
              sharedElements={route => {
                const {uri} = route.params;
                return [`image-${uri}`];
              }}
            />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

const ReduxWrappedApp: React.FC = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default ReduxWrappedApp;
