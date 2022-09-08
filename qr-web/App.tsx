import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import {StyleSheet, Text, View} from "react-native";
import {useSnapshot} from "valtio";
import {Login, Home} from "./src/components";
import {authState} from "./src/utils/authStore";
import {StackScreens} from "./src/utils/types";

const Stack = createStackNavigator<StackScreens>();

export default function App() {
  const state = useSnapshot(authState);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={"Login"} screenOptions={{headerShown: false}}>
        {state.accessToken !== "" ? (
          <Stack.Screen name={"Home"} component={Home} />
        ) : (
          <Stack.Screen name={"Login"} component={Login} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});
