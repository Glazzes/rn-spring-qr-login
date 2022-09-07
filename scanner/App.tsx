import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Home} from './src/home';
import {StackScreens} from './src/navigation/stackScreens';
import {NativeBaseProvider} from 'native-base';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import {useSnapshot} from 'valtio';
import {authState} from './src/store/authStore';
import Login from './src/login/Login';
import {LogBox} from 'react-native';
import {DeviceInformation, PostScanInformation} from './src/post-scan';
import {Scanner} from './src/scanner';
import ScanWarning from './src/other/ScanWarning';

LogBox.ignoreLogs(['[react-native-gesture-handler]']);

const Stack = createSharedElementStackNavigator<StackScreens>();

const App: React.FC = () => {
  const snap = useSnapshot(authState);

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        {snap.accessToken === '' ? (
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name={'Login'} component={Login} />
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

            <Stack.Screen name={'Success'} component={PostScanInformation} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

export default App;
