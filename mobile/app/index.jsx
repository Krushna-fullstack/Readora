import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";

const index = () => {
  const { user, token, checkAuth, logout } = useAuthStore();

  console.log(user, token);

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome to Home</Text>

      <Text>Hello {user?.username}</Text>
      <Text>{token}</Text>
      <Link href="(auth)/signup" style={{ padding: 5, color: "blue" }}>
        Signup
      </Link>

      <Link href="(auth)">Login</Link>

      <TouchableOpacity onPress={logout} style={{ marginTop: 20 }}>
        <Text style={{ color: "red" }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default index;
