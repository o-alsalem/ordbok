import { rest } from "msw";

export const handlers = [
  // Hantera GET-förfrågningar till URL:EN med en parameter (":word") och svara baserat på värdet av den parametern
  rest.get(
    "https://api.dictionaryapi.dev/api/v2/entries/en/:word",
    (req, res, ctx) => {
      // Extrahera "word"-parametern från URL:en
      const word = req.params.word;

      // Om ordet är "test", svara med en framgångsrik respons som innehåller detaljer om ordet
      if (word === "test") {
        return res(
          ctx.status(200), // Sätt HTTP-statuskoden till 200 (framgång)
          // Sätter svarets kropp till en JSON-sträng som innehåller ordinformation
          ctx.json([
            {
              word: "test",
              phonetics: [{ text: "tɛst", audio: "https://test.com/test.mp3" }],
              meanings: [
                {
                  partOfSpeech: "noun",
                  definitions: [
                    {
                      definition:
                        "A procedure intended to establish the quality, performance, or reliability of something, especially before it is taken into widespread use.",
                      example: "no pesticide has undergone rigorous testing",
                    },
                  ],
                },
              ],
            },
          ])
        );
      }

      // Om ordet inte är "test", svara med en 404-statuskod och ett felmeddelande
      return res(ctx.status(404), ctx.json({ message: "Not Found" }));
    }
  ),
];
