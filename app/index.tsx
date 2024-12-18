import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Button,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Header } from "@/components/Header";
import { PresentationForm } from "../components/PresentationForm";
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
  const [fileUri, setFileUri] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setInput((prev) => ({ ...prev, [field]: value }));
  };

  const handleShowAds = () => {
    console.log("Ads are being shown");
    setCredits((prevCredits) => prevCredits + 10); // Adding credits for ads
  };

  // Updated generatePPT function to handle blob properly with added logs
  const generatePPT = async () => {
    if (loading) return; // Prevent multiple requests

    // Input validation
    if (!input.topic || !input.numberOfSlides || !input.tone) {
      Alert.alert("Error", "Please fill in all fields before generating the presentation.");
      return;
    }

    setLoading(true);

    try {
      console.log("Input data:", input);
      const response = await fetch(
        "https://pptmakerbackend.onrender.com/generate-ppt/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic: input.topic,
            template: "tech", // TODO: make this dynamic
            slides: parseInt(input.numberOfSlides),
            tone: input.tone,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate PPT");
      }

      // Handle the response as a blob
      const blob = await response.blob();
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64data = (reader.result as string)?.split(',')[1];

        // Create directory if it doesn't exist
        const directoryUri = FileSystem.documentDirectory + "pptmakerai/";
        const dirInfo = await FileSystem.getInfoAsync(directoryUri);
        console.log("Directory info:", dirInfo);

        if (!dirInfo.exists) {
          console.log("Creating directory:", directoryUri);
          await FileSystem.makeDirectoryAsync(directoryUri, {
            intermediates: true,
          });
        }

        // Generate a unique file name
        const baseFileName = input.topic.replace(/\s+/g, "_").substring(0, 8);
        let fileUri = `${directoryUri}${baseFileName}.pptx`;
        let fileExists = await FileSystem.getInfoAsync(fileUri);

        let counter = 1;
        while (fileExists.exists) {
          fileUri = `${directoryUri}${baseFileName}_${counter}.pptx`;
          fileExists = await FileSystem.getInfoAsync(fileUri);
          counter++;
        }

        // Save the file to the directory
        if (base64data) {
          console.log("Writing file to:", fileUri);
          await FileSystem.writeAsStringAsync(fileUri, base64data, {
            encoding: FileSystem.EncodingType.Base64,
          });
          setFileUri(fileUri); // Set the file URI in state
          console.log("File saved successfully:", fileUri);
        } else {
          console.error("Base64 data is undefined");
        }
      };

      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Error during PPT generation:", error);
      Alert.alert("Error", error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <Header credits={credits} /> */}
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

        {/* <ActionButtons
          handleShowAds={handleShowAds}
          generatePPT={generatePPT}
        /> */}

        <TouchableOpacity
          style={styles.button}
          onPress={generatePPT}
          disabled={loading}
          
        >
          <Text style={styles.buttonText}>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              "Generate"
            )}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleShowAds}>
          <Text style={styles.buttonText}>Show Ads</Text>
        </TouchableOpacity>

        <Text style={styles.creditsText}>Credits Left: {credits}</Text>
        {/* <Button
          title=
          onPress={generatePPT}
          disabled={loading}
        /> */}
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        {fileUri && (
          <TouchableOpacity
            style={styles.card}
            onPress={() => Sharing.shareAsync(fileUri)}
          >
            <Text style={styles.cardTitle}>{input.topic}</Text>
          </TouchableOpacity>
        )}
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
  card: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
