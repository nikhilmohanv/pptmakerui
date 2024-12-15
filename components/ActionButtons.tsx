import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

interface ActionButtonsProps {
  handleShowAds: () => void;
  generatePPT: () => void;
}

export const ActionButtons = ({ handleShowAds, generatePPT }: ActionButtonsProps) => {
  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={generatePPT}>
        <Text style={styles.buttonText}>Generate</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleShowAds}>
        <Text style={styles.buttonText}>Show Ads</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
}); 