//loading spinner component
// to call this when page is loading.

import { View, StyleSheet, ActivityIndicator } from "react-native";

interface Props {
  visible: boolean;
}

export default function LoadingSpinner({ visible }: Props) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#B7A3E3" />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    paddingTop: 100,
    alignItems: "center",
    zIndex: 999,
  },
});
