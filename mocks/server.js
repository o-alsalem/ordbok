// Importera setupServer-funktionen från msw/node.
import { setupServer } from "msw/node";

// Importera handlers-objektet
import { handlers } from "./handlers";

// Skapa och exportera en serverinstans genom att anropa setupServer-funktionen med handlers som argument.
export const server = setupServer(...handlers);
