import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import RNPickerSelect from "react-native-picker-select";

interface PresentationFormProps {
  selectedValue: Input;
  setSelectedValue: React.Dispatch<React.SetStateAction<Input>>;
  tones: Record<string, string>;
}

interface Input {
  topic: string;
  numberOfSlides: string;
  tone: string;
}

export const PresentationForm = ({
  selectedValue,
  setSelectedValue,
  tones,
}: PresentationFormProps) => {
  return (
    <View>
      <TextInput
        placeholder="Topic"
        value={selectedValue.topic}
        onChangeText={(text) =>
          setSelectedValue({ ...selectedValue, topic: text })
        }
        style={styles.topicInput}
      />
      <TextInput
        placeholder="Number of slides"
        keyboardType="numeric"
        value={selectedValue.numberOfSlides}
        onChangeText={(text) =>
          setSelectedValue({ ...selectedValue, numberOfSlides: text })
        }
        style={styles.input}
      />
      <View style={styles.pickerWrapper}>
        <RNPickerSelect
          onValueChange={(value) =>
            setSelectedValue({ ...selectedValue, tone: value })
          }
          items={Object.entries(tones).map(([key, value]) => ({
            label: value,
            value: key,
          }))}
          style={{
            inputIOS: styles.picker,
            inputAndroid: styles.picker,
          }}
          placeholder={{ label: "Tone of PPT", value: "", color: "#9EA0A4" }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topicInput: {
    borderWidth: 0.6,
    borderColor: "#000",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    height: 100,
    textAlignVertical: "top",
  },
  input: {
    borderWidth: 0.6,
    borderColor: "#000",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerWrapper: {
    borderWidth: 0.6,
    borderColor: "#000",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    paddingHorizontal: 10,
    letterSpacing: 0.5,
  },
});
