import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useSnapshot} from 'valtio';
import {Login} from './src/login';
import {Home} from './src/home';
import {authState} from './src/utils/authStore';
import {StackScreens} from './src/utils/types';

const Stack = createStackNavigator<StackScreens>();

export default function App() {
  const state = useSnapshot(authState);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={'Login'} screenOptions={{headerShown: false}}>
        {state.accessToken !== '' ? (
          <Stack.Screen name={'Home'} component={Home} />
        ) : (
          <Stack.Screen name={'Login'} component={Login} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
