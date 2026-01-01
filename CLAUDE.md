# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint (eslint-config-next with TypeScript)
```

## Architecture

This is a Next.js 16 App Router project for IN-WAVE Architects, a design and architecture studio website. It uses React 19, TypeScript, and Tailwind CSS 4.

### Project Structure

- `src/app/` - Next.js App Router pages (layout.tsx, page.tsx, globals.css)
- `src/components/` - React components for each page section
- `src/hooks/useAnimations.ts` - Centralized GSAP/ScrollTrigger animation hooks
- `public/css/` - Legacy CSS files from WordPress migration (loaded in layout.tsx)
- `public/images/` - Static image assets

### Animation System

The site uses GSAP with ScrollTrigger for scroll-based animations, integrated with Lenis for smooth scrolling:

- **SmoothScroll.tsx** - Initializes Lenis and connects it to GSAP's ticker. Handles anchor link scrolling with `.js-anchor-scroll` class.
- **useAnimations.ts** - Shared animation hooks (`useGalleryAnimations`, `useFormTitleAnimations`, `useWorkStagesAnimations`, `useHeaderScroll`) that create ScrollTrigger instances for various page sections.
- Components like Hero.tsx and Gallery.tsx manage their own ScrollTrigger animations locally.

Pattern for client components with GSAP:
```tsx
'use client';
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
```

### Key Dependencies

- **gsap** + **ScrollTrigger** - All scroll-driven animations
- **lenis** - Smooth scroll behavior
- **swiper** - Hero carousel and other sliders

### Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json)

### Styling

The project uses Tailwind CSS 4 (via `@tailwindcss/postcss`) alongside legacy CSS files in `public/css/`. The legacy stylesheets are loaded directly in the HTML head via layout.tsx rather than imported as modules.
