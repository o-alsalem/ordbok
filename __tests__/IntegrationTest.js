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

test("it shows the definition when a valid word is entered", async () => {
  // Rendera App-komponenten och hämta nödvändiga query-funktioner
  const { getByPlaceholderText, getByText, getByTestId } = render(<App />);

  // Hämta input-fältet via dess placeholder text
  const input = getByPlaceholderText("Sök efter definitionen av ett ord.");

  // Ändra texten i input-fältet till "test".
  fireEvent.changeText(input, "test");

  // Hämta sökknappen via  testID och klicka på den
  const searchButton = getByTestId("search-button");
  fireEvent.press(searchButton);

  // Vänta upp till 5 sekunder för att texten med definitionen ska visas medan 'Loading...' visas, det vill säga under tiden data hämtas från servern *
  await waitFor(
    () =>
      getByText(
        "A procedure intended to establish the quality, performance, or reliability of something, especially before it is taken into widespread use."
      ),
    {
      timeout: 5000,
    }
  );
});
