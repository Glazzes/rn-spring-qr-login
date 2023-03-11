import React, {useEffect} from 'react';
import {Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useSnapshot} from 'valtio';
import {Login} from './src/login';
import {Home} from './src/home';
import {authState, setIsAuthenticated} from './src/utils/authStore';
import {StackScreens} from './src/utils/types';
import NotFound from './src/shared/NotFound';

const Stack = createStackNavigator<StackScreens>();

export default function App() {
  const state = useSnapshot(authState);

  useEffect(() => {
    const tokenString = localStorage.getItem('tokens')
    if(tokenString) {
      setIsAuthenticated(true)
    }
  }, [])

  return (
    <NavigationContainer linking={{
      prefixes: [],
      config: {
        screens: {
          Home: '/me',
          Login: '/login',
          NotFound: "*"
        },
      }
    }} fallback={<Text>Loading ...</Text>} >
      <Stack.Navigator initialRouteName={'Login'} screenOptions={{headerShown: false}}>
        {state.isAuthenticated ? (
          <Stack.Screen name={'Home'} component={Home} />
        ) : (
          <Stack.Screen name={'Login'} component={Login} />
        )}
        <Stack.Screen name={"NotFound"} component={NotFound} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
