# Design System

## Layout & Navigation

| Device | Navigation pattern |
|--------|--------------------|
| Mobile (< 768px) | Bottom tab bar (3 tabs: Overview, Explore, Search) |
| Tablet (768–1024px) | Thin sidebar rail with icons |
| Desktop (> 1024px) | Persistent left sidebar + top bar with breadcrumbs |

No hamburger menus. Navigation is always visible.

## Color Palette

| Role | Token | Value |
|------|-------|-------|
| Primary | `--primary` | `#5B3B8C` (deep muted plum) |
| Primary foreground | `--primary-foreground` | `#FFFFFF` |
| Surface background | `--background` | `#EDE4F3` (soft lavender) |
| Card / elevated surface | `--card` | `#FFFFFF` |
| Text (primary) | `--foreground` | `#2D2A3D` (near-black with slight purple cast) |
| Text (muted) | `--muted-foreground` | `#6B6580` |
| Border | `--border` | `#D6CFE0` |
| Accent | `--accent` | `#7C5CBF` |
| Ring / focus | `--ring` | `#5B3B8C` |

Polite, calm, academic purple tone. Not loud or playful.

## Typography

- **UI (body, labels, tables):** Inter — system-friendly, crisp at small sizes.
- **Headings:** IBM Plex Serif — academic, readable, adds character without being decorative.
- Scale: `text-xs` through `text-4xl` following Tailwind defaults.

## Component Visual Style

- Cards/panels/table rows: `border`, `shadow-sm`, `rounded-lg`, generous padding.
- Table headers: sticky, subtle `bg-muted` background.
- Row hover: gentle background shift (`hover:bg-muted/50`).
- No heavy shadows, no flat-no-border extremes.

## Data Display

- **Mobile:** card-based layout for journal entries — compact, swipeable.
- **Tablet / Desktop (`md+`):** bordered table with sticky header row.
- Row density matches standard table density (not overly padded).

## Search & Filter (Journal Search)

- **Desktop:** collapsible filter sidebar left of results.
- **Mobile:** filter panel slides in as a drawer.
- Filters apply on explicit "Apply" button — no live filtering that causes jarring re-renders.

## Overview Page (Homepage)

1. Top row: 4 stat cards in a responsive grid.
   - 1 col on mobile, 2 col on tablet, 4 col on desktop.
2. Below: "Top Journals" section — compact table with sparkline/mini-chart per row.

## Area Explorer

- **Desktop:** three-column progressive disclosure — areas list | groups | journals.
- **Mobile:** stacked accordion panels (expand area → shows groups → expand group → shows journals).

## Empty & Loading States

- **Loading:** skeleton placeholders matching final layout shape (card skeletons, row skeletons), subtle pulse animation.
- **Empty state:** centered icon + short message + suggested action button.
- No spinners, no full-page loaders.

## Responsive Breakpoints

| Breakpoint | Width | Layout behavior |
|------------|-------|-----------------|
| Mobile | < 768px | Bottom tab nav, cards, stacked accordions, drawer filters |
| Tablet | 768–1024px | Sidebar rail, table view, persistent filters |
| Desktop | > 1024px | Full sidebar, table + columns, collapsible filter panel |
