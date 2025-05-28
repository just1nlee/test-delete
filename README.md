[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/_nScgA8a)
[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=19657963)
# Chart App

This simple charts creation app allows user to:

- create line, scatter, and bar charts/plots
- specify `x` and `y` values to be plotted
- specify labels for the `x` and `y` axis
- clear chart data
- save chart to local storage
- visualize saved graphs in gallery view
- re-open saved graphs
- delete saved graphs

This app uses local storage.

This app is designed for software testing purposes, ideally using Vitest and Playwright. The software testing dependencies are not included.

Install dependencies with:

```sh
npm install
```

Run the development server with:

```sh
npm run dev -- --open
```

> The development server can be accessed at [localhost:5173/](http://localhost:5173/).

To build the app, run:

```sh
npm run build
```

Preview your production build locally with:

```sh
npm run preview -- --open
```

> The local production build can be accessed at [localhost:4173/](http://localhost:4173/).

This app uses [QuickChart](https://quickchart.io/), Vite, SvelteKit/Svelte 5, TailwindCSS, and HeroIcons.
