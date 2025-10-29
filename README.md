# 3D Greeting Card

Interactive 3D greeting card demo built with Next.js 14, TypeScript, and three.js via react-three-fiber.

## Features

- Animated two-panel greeting card with hinge-based opening/closing.
- Texture-mapped artwork for front, back, and inner faces.
- OrbitControls-driven camera with drag orbiting and smooth reset.
- Spring-driven motion for the card leaves and framer-motion UI accents.
- Zustand-powered finite state machine handling the card interaction flow.

## Getting Started

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000 to view the demo.

## Scripts

- `pnpm dev` – Start the Next.js development server.
- `pnpm build` – Create a production build.
- `pnpm start` – Start the production server.
- `pnpm lint` – Run ESLint with the project rules.

## Notes

- Textures are located in `public/images` and mapped according to their filenames.
- The card opens when clicking the front cover, and can close to the front or back by clicking the respective inside panels.
- The “Reset View” button re-centers both the camera and the card to the default closed-front pose.
