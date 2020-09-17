# fastcomments-debug-chrome

This is a Chrome Extension built with TypeScript and Parcel for debugging your FastComments installation.

## What issues can this find?
* How many instances of the widget are active?
* Why isn't the widget rendering? Check for exceptions, invalid configuration.
* What page is the widget rendering for?

## This consists of the following parts

* Background script (vanilla TS)
* Content script (vanilla TS)
* Options page (Vue.js, Sass)
* Popup page (Vue.js, Sass)
* DevTools panel page (React.js, Styled Components)

_And, of course, the `./manifest.json` file describing its configuration._

## Environment

* Node.js >=12.0.0
* NPM >= 6.0.0

_Most probably it will work with earlier versions too but I didn't test it._

## Testing

`Jest` is included and ready for the vanilla TS parts. Testing for React/Vue is not included in order to keep the Jest config clean.

## Scripts

* `npm run dist` - build the extension into `./dist` folder
* `npm run lint` - ESLint for `.ts` and `.tsx` files
* `npm run test` - Jest unit tests
