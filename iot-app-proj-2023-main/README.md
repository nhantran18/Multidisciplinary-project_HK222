# IoT application project - 2023

## How to run

- Install dependencies

```bash
npm install
```

- Run the app

```bash
npx expo start
# or
npx expo start --tunnel
```

## Directory structure

```bash
.
├── services
├── app
│   ├── _layout.tsx
│   └── (screens)
│       ├── index.tsx
│       ├── _layout.tsx
├── assets
│   ├── fonts
│   └── images
├── components
│   └── atoms
│   └── molecules
│   └── organisms
├── constants
├── hooks
├── store
├── types
└── utils
```

- `services`: network API calls, Firebase integration, etc.
- `app`: where our app starts (read [expo-router docs](https://expo.github.io/router/docs))
  - `app/_layout.tsx`: root layout
  - `app/(screens)`: main screens
- `assets`: images and other files to bundle with the app
- `components`: reusable components. We will apply Atomic Design in this project ([see more](https://github.com/danilowoz/react-atomic-design))
  - `components/atoms`: the smallest possible components, such as buttons, titles, inputs or event color pallets, animations, and fonts. They can be applied on any context, globally or within other components and templates, besides having many states, such as this example of button: disabled, hover, different sizes, etc.
  - `components/molecules`: the composition of one or more components of atoms. Here we begin to compose complex components and reuse some of those components. Molecules can have their own properties and create functionalities by using atoms, which don’t have any function or action by themselves.
  - `components/organisms`: the combination of molecules that work together or even with atoms that compose more elaborate interfaces. At this level, the components begin to have the final shape, but they are still ensured to be independent, portable and reusable enough to be reusable in any content.
- `constants`: constants we will use throughout the app (colors, text styles, etc.)
- `hooks`: custom hooks
- `store`: contains Zustand-related files (stores, etc.)
- `utils`: utility functions (string manipulation, date formatting, etc.)
- `types`: where you place your TypeScript type definition files (`.d.ts`) here

## Recommended coding style

- [MDN JavaScript Style Guide](https://developer.mozilla.org/en-US/docs/MDN/Guidelines/Code_guidelines/JavaScript)
- [Commit message format](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#-commit-message-format)

## Tech stack

### Main

- [Expo](https://docs.expo.io/) - React Native framework
- [Pocketbase](https://pocketbase.io/) - Open Source Backend-as-a-Service (BaaS)

### Other

- Styling (optional): [Tailwind React Native Classnames](https://github.com/jaredh159/tailwind-react-native-classnames)
- State management: [Zustand](https://github.com/pmndrs/zustand)
- Navigation: [Expo Router](https://expo.github.io/router/docs)
- Code quality tools: [Rome](https://rome.tools)
- Testing: [Jest](https://jestjs.io/)
- CI/CD: GitHub Actions
- Language: [TypeScript](https://www.typescriptlang.org/)

## Note

- Please use `.env` file to store your environment variables instead of hardcoding them in the codebase
