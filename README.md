# Next.js Movie App

## Setup

- Place your TMDB API key in a `.env.local` file at the project root:
  NEXT_PUBLIC_TMDB_API_KEY=your_api_key_here

- Add the following configuration to `next.config.js` to allow loading images from TMDB:

```js
module.exports = {
  images: {
    domains: ['image.tmdb.org'],
  },
};
```

## Explanations
**Design Decisions**
- Navbar: Provides flexible navigation across the app.
- Footer: Used for copyright and potential contact information.
- Favorites: Managed globally using Zustand with localStorage persistence for a seamless user experience.
- Responsive Design: CSS modules and media queries ensure the app looks good on all devices.

**Challenges Faced**
- Next.js: I started with limited knowledge of Next.js. A one-hour crash course helped me quickly get up to speed and apply what I learned in this project.
- Zustand: My previous state management experience was mainly with Context API. Learning Zustand was enjoyable, especially using its middleware for localStorage persistence.

**SSR vs. Client Components**
I understand the difference between SSR (Server-Side Rendering) and client components in Next.js. SSR does not support React hooks, while client components do. For this project, I used client components for familiarity and flexibility, as my experience is stronger with React than with Next.js SSR.