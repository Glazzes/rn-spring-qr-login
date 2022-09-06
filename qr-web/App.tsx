import {StyleSheet, Text, View} from "react-native";
import QrCodeLogin from "./src/QrCodeLogin";

export default function App() {
  return (
    <View style={styles.container}>
      <QrCodeLogin />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
