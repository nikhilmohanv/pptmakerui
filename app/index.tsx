import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Header } from "@/components/Header";
import { PresentationForm } from "../components/PresentationForm";
import { ActionButtons } from "../components/ActionButtons";
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

        <ActionButtons handleShowAds={handleShowAds} />

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
