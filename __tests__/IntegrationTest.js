import { render, waitFor, fireEvent } from "@testing-library/react-native";
import { rest } from "msw";
import { setupServer } from "msw/node";

import App from "../App";
import { handlers } from "../mocks/handlers";

// Skapa en server för att hantera API-anrop under testerna
const server = setupServer(...handlers);

// Starta servern innan alla tester körs
beforeAll(() => server.listen());

// Återställ serverns hanterare efter varje test
afterEach(() => server.resetHandlers());

// Stäng servern efter att alla tester har körts
afterAll(() => server.close());

// Tester som bekräftar att definitionen visas när ett giltigt ord anges
test("it shows the definition when a valid word is entered", async () => {
  // Rendera App-komponenten och hämta nödvändiga query-funktioner
  const { getByPlaceholderText, getByText, getByTestId } = render(<App />);

  // Hämta input-fältet via dess placeholder text
  const input = getByPlaceholderText("Sök efter definitionen av ett ord.");

  // Ändra texten i input-fältet till "test".
  fireEvent.changeText(input, "test");

  // Hämta sökknappen via testID och klicka på den
  const searchButton = getByTestId("search-button");
  fireEvent.press(searchButton);

  // Vänta upp till 5 sekunder för att texten med definitionen ska visas
  await waitFor(
    () =>
      getByText(
        "A procedure intended to establish the quality, performance, or reliability of something, especially before it is taken into widespread use."
      ),
    { timeout: 5000 }
  );
});

// Tester som bekräftar att ett felmeddelande visas när inget ord anges
test("it shows an error message when input is empty", async () => {
  const { getByPlaceholderText, getByText, getByTestId } = render(<App />);

  const input = getByPlaceholderText("Sök efter definitionen av ett ord.");
  fireEvent.changeText(input, "");

  const searchButton = getByTestId("search-button");
  fireEvent.press(searchButton);

  await waitFor(() => getByText("Du måste ange ett ord"), {
    timeout: 5000,
  });
});

// Tester som bekräftar att ett meddelande om att ordet inte finns visas när ett ord som inte finns anges
test("it shows a not found message for non-existent word", async () => {
  const { getByPlaceholderText, getByText, getByTestId } = render(<App />);

  const input = getByPlaceholderText("Sök efter definitionen av ett ord.");
  fireEvent.changeText(input, "nofrfnerfrfrfrfrfrfxistedsdrfrntwofrfrfrd");

  const searchButton = getByTestId("search-button");
  fireEvent.press(searchButton);

  await waitFor(
    () => getByText("Ett problem uppstod när vi skulle blädra ordboken eller saknas definionen av ordet du söker"),
    {
      timeout: 6000,
    }
  );
});

// Tester som bekräftar att appen hanterar API-fel på ett bra sätt
test("it handles API errors gracefully", async () => {
  // Överlagra en befintlig MSW-hanterare med en som returnerar ett 500-serverfel
  server.use(
    rest.get(
      "https://api.dictionaryapi.dev/api/v2/entries/en/:word",
      (req, res, ctx) => {
        return res(ctx.status(500));
      }
    )
  );

  const { getByPlaceholderText, getByText, getByTestId } = render(<App />);

  const input = getByPlaceholderText("Sök efter definitionen av ett ord.");
  fireEvent.changeText(input, "test");

  const searchButton = getByTestId("search-button");
  fireEvent.press(searchButton);

  await waitFor(
    () =>
      getByText(
        "Ett problem uppstod när vi skulle blädra ordboken eller saknas definionen av ordet du söker"
      ),
    {
      timeout: 1000,
    }
  );
});

// Tester som bekräftar att ljuduppspelningen fungerar som den ska
test("it plays audio correctly", async () => {
  const { getByPlaceholderText, getByText, getByTestId } = render(<App />);

  const input = getByPlaceholderText("Sök efter definitionen av ett ord.");
  fireEvent.changeText(input, "test");

  const searchButton = getByTestId("search-button");
  fireEvent.press(searchButton);

  await waitFor(() => getByText("Lyssna"), {
    timeout: 5000,
  });

  // Tryck på Lyssna-knappen och kontrollera att ljuduppspelningen fungerar som den ska
  fireEvent.press(getByText("Lyssna"));
});

// Tester som bekräftar att en laddningsindikator visas medan ord hämtas
test("it shows a loading indicator while fetching the data", async () => {
  const { getByPlaceholderText, getByText, getByTestId } = render(<App />);

  const input = getByPlaceholderText("Sök efter definitionen av ett ord.");
  fireEvent.changeText(input, "test");

  const searchButton = getByTestId("search-button");
  fireEvent.press(searchButton);

  // Förvänta sig att "Loading..." syns.
  expect(getByText("Loading...")).toBeTruthy();
});
