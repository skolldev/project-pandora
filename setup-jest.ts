import "jest-preset-angular/setup-jest";
import "@testing-library/jest-dom";
import { configure } from "@testing-library/angular";
import "./jest-global-mocks";

import { server } from "./src/mocks/node";
configure({});
beforeAll(() => server.listen());
// if you need to add a handler after calling setupServer for some specific test
// this will remove that handler for the rest of them
// (which is important for test isolation):
afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
});
afterAll(() => server.close());
