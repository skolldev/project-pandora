import { setupWorker, rest } from "msw";
import { handlers } from "./handlers";

const worker = setupWorker(...handlers);

export { worker, rest };
