import { StatusBar } from "expo-status-bar";
import React, { useState } from "react"; //Importerar state från react.
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { Audio } from "expo-av";

export default function App() {
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState(""); // Skapar en state kommer ihåg inmatade ordet.
  const [audio, setAudio] = useState(""); // Skapar en state kommer ihåg ljudfilen
  const [definition, setDefinition] = useState(null); // Skapar en state som kommer ihpg definitionen av ordet.
  const [loading, setLoading] = useState(false);

  const searchDefinition = async () => {
    // Kontrollera om inputValue är tomt eller bara innehåller mellanslag, och i så fall, avsluta funktionen tidigt
    if (inputValue.trim().length === 0) {
      setError("Du måste ange ett ord"); // Ger ett fel meddelande om fältet är tomt
      return;
    }

    setError(null); // 1. Återställer fel meddelandet om användaren inmatar data i fältet
    setLoading(true); // 2. Sätter loading till sann igen.
    setDefinition(null); // 3. Sätter definitionen till tomt igen.

    try {
      // Skicka en begäran till API:et med det trimmade inputValue som parameter i URL:en
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${inputValue.trim()}`
      );

      // Kontrollera om svaret är OK (statuskod 200-299), om inte, kasta ett fel med statusText
      if (!response.ok) {
        throw new Error("Server problem uppstod " + response.statusText);
      }

      // Omvandla svaret till JSON
      const data = await response.json();

      // Kontrollera om data innehåller en definition, om inte sätt ett felmeddelande
      if (
        data.length > 0 &&
        data[0].meanings.length > 0 &&
        data[0].meanings[0].definitions.length > 0
      ) {
        // Om en definition hittas, uppdatera state med definitionen
        setDefinition(data[0].meanings[0].definitions[0].definition);
        // Om en ljudfil hittas, updateras sate med uri.
        if (data[0].phonetics && data[0].phonetics[0].audio) {
          setAudio(data[0].phonetics[0].audio);
        }
      } else {
        // Om ingen definition hittades, uppdatera state med ett meddelande som indikerar detta
        setDefinition("Ordet eller defintionen hittades inte hos oss.");
      }
    } catch (error) {
      // Om ett fel uppstår under sökningen, fånga det och uppdatera state med ett felmeddelande
      setDefinition(
        "Ett problem uppstod när vi skulle blädra ordboken eller saknas definionen av ordet du söker"
      );
    }
    // Efter att sökningen är avslutad (antingen framgångsrik eller med ett fel), sätt loading till false
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text>Sök och hitta definonen bland 100 000-tals ord. </Text>
      <View style={styles.appHolder}>
        {/* EN view som håller i sökfältet och resultat */}
        <TextInput // Ett input fält där inmatad data skickas till inputValue state.
          style={styles.input}
          placeholder="Sök efter definitionen av ett ord."
          value={inputValue}
          onSubmitEditing={searchDefinition}
          onChangeText={(text) => setInputValue(text)}
        />
        {error && <Text style={styles.errorMessage}>{error}</Text>}

        {/* Added view for the search result */}
        <View style={styles.result}>
          <Text style={styles.resultTitlle}>Definition:</Text>

          {loading && <Text style={{ padding: 30 }}>Loading...</Text>}
          {definition && (
            <Text style={{ padding: 30, paddingTop: 0 }}>{definition}</Text>
          )}
          {/* En knapp för uppspelning av ljud */}
          {audio && (
            <Button
              style={styles.playButton}
              title="Lyssna"
              onPress={async () => {
                const soundObject = new Audio.Sound();
                try {
                  await soundObject.loadAsync({ uri: audio });
                  await soundObject.playAsync();
                } catch (error) {
                  console.error(error);
                }
              }}
            />
          )}
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
  resultTitlle: {
    padding: 30,
    color: "#bebebe",
  },
  playButton: {
    height: 50,
  },
});
