# Starter

This is a starter for Angular 12 with TailwindCSS.

It supports testing via Jest & Testing Library, adding mocking capabilities for tests and local development using MSW.
Linting is done via eslint.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files. MSW will automatically mock all paths you added

## Mocking

This project supports mocking via [MSW](https://mswjs.io/). This is available during tests, as well as for local development.
The mocking works via a service worker that intercepts requests you explicitly declared to be mocked, and returning a mocked response.

To add a mocked route, go to `src/mocks`. `handlers.ts` contains all handlers, these are used by `browser.ts` for local development, and `node.ts` for tests. To find out more, check the documentation for MSW.

## Testing

Testing is done via [jest](https://jestjs.io/) in combination with [Testing Library](https://testing-library.com/).

## Tailwind

To enable purge, simply run a production build. Angular will internally set the environment variable `TAILWIND_MODE` to `build`, enabling purge.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `jest` to execute the unit tests via Jest.
