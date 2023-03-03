import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Home} from './src/home';
import {StackScreens} from './src/navigation/stackScreens';
import {NativeBaseProvider} from 'native-base';
import {useSnapshot} from 'valtio';
import {authState} from './src/store/authStore';
import {LogBox} from 'react-native';
import {DeviceInformation, PostScanInformation} from './src/post-scan';
import {Scanner} from './src/scanner';
import ScanWarning from './src/other/ScanWarning';
import {CreateAccount, Login} from './src/onboarding';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import {CropEditor} from './src/crop_editor';
import {Provider} from 'react-redux';
import {store} from './src/store/store';

LogBox.ignoreLogs(['[react-native-gesture-handler]']);

const Stack = createSharedElementStackNavigator<StackScreens>();

const App: React.FC = () => {
  const snap = useSnapshot(authState);

  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <NavigationContainer>
          {snap.tokens.accessToken === '' ? (
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
          ) : (
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

              <Stack.Screen
                name={'ScanResult'}
                component={PostScanInformation}
              />
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </NativeBaseProvider>
    </Provider>
  );
};

export default App;
