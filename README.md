# Nemesis Helper

Helper Application for Nemesis boardgame published by Awaken realms.

Full list of features can be found at [BGG App post](https://boardgamegeek.com/thread/3271434/helper-application-nemesis-games).

Application hosted on [GitHub Pages](https://your-username.github.io/nemesis-helper/).

This is PWA App, which means you can install it once and have it on your device (including desktop) as an Application with shortcut. This will allow using this App without access to the internet.

### About Application

Available games in the App:

1. Nemesis

#### App Features:

**Players section:**

-   player numbers with names
-   turn timers (when enabled)

**Time Tracker section:**

-   round number
-   self-destruct / autodestruction indicator and end game reminded
-   end game summary (victory check)

**Monsters section:**

-   monster tokens (adult, larvae, eggs, queen)
-   monster development
-   monster summary

**Phases section:**

-   current phase indicator
-   phase timers (when enabled)

**Summary section:**

-   game statistics
-   game logs

### Development

#### Prerequisites

-   Node.js (v20.12.1 or higher)
-   npm (v10.5.0 or higher)

#### Installation

```bash
npm install
```

#### Development server

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

#### Build

```bash
npm run build
```

#### Build for GitHub Pages

```bash
npm run build:github-pages
```

#### Deploy to GitHub Pages

```bash
npm run deploy:github-pages
```

#### Running unit tests

```bash
npm test
```

#### Running end-to-end tests

```bash
npm run e2e
```

### Deployment

The application is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

To deploy manually:

1. Build the application for GitHub Pages:
   ```bash
   npm run build:github-pages
   ```

2. Deploy to GitHub Pages:
   ```bash
   npm run deploy:github-pages
   ```

### Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
