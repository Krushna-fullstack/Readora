import { View, Text } from "react-native";
import { Link } from "expo-router";

const index = () => {
  return (
    <View>
      <Text>index</Text>
      <Link href="(auth)/signup">Signup</Link>
      <Link href="(auth)">Login</Link>
    </View>
  );
};

export default index;
