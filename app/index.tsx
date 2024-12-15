import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Header } from "@/components/Header";
import { PresentationForm } from "../components/PresentationForm";
import { ActionButtons } from "../components/ActionButtons";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
const tones = { Professional: "professional", Creative: "creative" };

export default function App() {
  const [credits, setCredits] = useState(100); // Example initial credits
  const [input, setInput] = useState({
    topic: "",
    numberOfSlides: "5",
    tone: "professional",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setInput((prev) => ({ ...prev, [field]: value }));
  };

  const handleGeneratePresentation = async () => {
    if (!input.topic) {
      alert("Please fill in all fields");
      return;
    }

    if (credits < 10) {
      // Example cost of 10 credits per presentation
      alert("Not enough credits");
      return;
    }

    setLoading(true);
    try {
      // Your existing API call logic here
      const presentationData = {
        ...input,
        numberOfSlides: parseInt(input.numberOfSlides),
      };

      const response = await fetch("YOUR_BACKEND_URL/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(presentationData),
      });

      const result = await response.json();
      // const fileUri = `${FileSystem.documentDirectory}presentation.pptx`;
      // await Sharing.shareAsync(fileUri);

      // Deduct credits after successful generation
      setCredits((prev) => prev - 10);
    } catch (error) {
      console.error("Error:", error);
      alert("Error generating presentation");
    } finally {
      setLoading(false);
    }
  };

  const handleShowAds = () => {
    console.log("Ads are being shown");
    setCredits((prevCredits) => prevCredits - 10);
  };
  const generatePPT = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/generate-ppt/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: input.topic,
          template: "dark", // TODO: make this dynamic
          slides: input.numberOfSlides,
          tone: input.tone,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PPT");
      }

      const blob = await response.blob();
      const reader = new FileReader();
      const base64String = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

      const fileUri = FileSystem.documentDirectory + "presentation.pptx";
      await FileSystem.writeAsStringAsync(fileUri, base64String.split(",")[1]);

      await Sharing.shareAsync(fileUri);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <>
      <Header credits={credits} />
      <View style={styles.container}>
        <Text style={styles.title}>Create Stunning Presentations</Text>
        <Text style={styles.subtitle}>
          Start with a topic. Convert to presentation easily.
        </Text>

        <PresentationForm
          selectedValue={input}
          setSelectedValue={setInput}
          tones={tones}
        />

        <ActionButtons
          handleShowAds={handleShowAds}
          generatePPT={generatePPT}
        />

        <Text style={styles.creditsText}>Credits Left: {credits}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 45,
    fontWeight: "800",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
    marginBottom: 20,
  },
  creditsText: {
    fontSize: 16,
    color: "gray",
    marginTop: 10,
    textAlign: "center",
  },
});
