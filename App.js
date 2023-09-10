import { StatusBar } from "expo-status-bar";
import React, { useState } from "react"; //Importerar state från react.
import { StyleSheet, Text, View, TextInput } from "react-native";

export default function App() {
  const [inputValue, setInputValue] = useState(""); // Skapar en state kommer ihåg inmatade ordet.

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text>Open up App.js to start working on your app!</Text>
      <View style={styles.appHolder}>
        {/* EN view som håller i sökfältet och resultat */}
        <TextInput // Ett input fält där inmatad data skickas till inputValue state.
          style={styles.input}
          placeholder="Enter text here"
          value={inputValue}
          onChangeText={(text) => setInputValue(text)}
        />

        <View style={styles.result}>
          {/* Added view for the search result */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
    justifyContent: "center",
  },
  appHolder: {
    width: "50%",
    height: "50%",
  },
  input: {
    marginTop: 30,
    paddingLeft: 30,
    padding: 20,
    width: "100%",
    borderWidth: 2,
    borderColor: "#eee",
    borderRadius: 30,
    backgroundColor: "#ffffff",
  },
  result: {
    marginTop: 30,
    height: 200,
    width: "100%",
    borderWidth: 2,
    borderColor: "#eee",
    backgroundColor: "#ffffff",
    borderRadius: 15,
  },
});
