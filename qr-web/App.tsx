import React, {useEffect} from 'react';
import {Text, StyleSheet, View, ActivityIndicator} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useSnapshot} from 'valtio';
import {Login} from './src/login';
import {Home} from './src/home';
import {authState, setIsAuthenticated} from './src/utils/authStore';
import {StackScreens} from './src/utils/types';
import NotFound from './src/shared/NotFound';
import {useFonts} from 'expo-font';

const Stack = createStackNavigator<StackScreens>();

export default function App() {
  const state = useSnapshot(authState);
  const [fontsLoaded] = useFonts({
    "ExtraBold": require("./assets/fonts/ExtraBold.ttf"),
    "SemiBold": require("./assets/fonts/SemiBold.ttf"),
    "Regular": require("./assets/fonts/Regular.ttf")
  })

  useEffect(() => {
    const tokenString = localStorage.getItem('tokens')
    if(tokenString) {
      setIsAuthenticated(true)
    }
  }, [])

  if(!fontsLoaded) {
    return (
      <View style={styles.root}>
        <ActivityIndicator color={""} size={"large"} />
      </View>
    )
  }

  return (
    <NavigationContainer linking={{
      prefixes: [],
      config: {
        screens: {
          Login: '/',
          Home: '/me',
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
