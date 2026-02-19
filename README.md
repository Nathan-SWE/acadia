# Acadia Product Grid

A clean, fast product catalog built entirely with vanilla web technologies. Browse products, search in real time, manage your cart with a single click, and add new products through an intuitive modal form with image upload and drag-and-drop support. No frameworks, no dependencies at runtime, just the browser doing what it does best.

[Live Demo](https://acadia-puce.vercel.app/) &nbsp;

---

| **vMobile**  | **vDesktop**  |
| ------------ | ------------- |
| ![Mobile](#) | ![Desktop](#) |

---

## Tech Stack & Architecture

### Technologies

| Layer   | Technology                                      |
| ------- | ----------------------------------------------- |
| Markup  | **HTML5** semantic elements                     |
| Styling | **CSS3** with Custom Properties (design tokens) |
| Logic   | **JavaScript ES6+** (native modules)            |
| Fonts   | Google Fonts (Inter)                            |

### Techniques & Patterns Applied

- **ES6 Modules** -- the entire JavaScript layer is split into self-contained modules (`state.js`, `main.js`, `ProductCard.js`, `sanitize.js`, `format.js`, `toast.js`) loaded via `<script type="module">`.
- **Event Delegation** -- a single `click` listener on the product grid container handles every "Add to Cart" / "Remove from Cart" button, regardless of how many cards exist or get added dynamically.
- **State-Driven UI (Store Pattern)** -- a centralized `createStore()` factory encapsulates all product data, exposes getters/mutators (`getProducts`, `toggleCart`, `addCustomProduct`), and notifies subscribers on mutations.
- **CSS Design Tokens** -- all colors, spacing, typography, radii, shadows, and transitions are declared as CSS custom properties in `variables.css`, making the theme adjustable from a single file.
- **BEM Naming Convention** -- every CSS class follows the Block-Element-Modifier pattern (`card__title`, `card__btn--added`, `form-field__input--error`).
- **CSS Component Isolation** -- each visual component has its own stylesheet (`header.css`, `search.css`, `card.css`, `modal.css`, `toast.css`), keeping concerns separated and maintainable.

### SEO

- Semantic HTML5 tags: `<header>`, `<main>`, `<section>`, `<article>`, `<nav>`.
- Descriptive `<meta name="description">` tag.
- Meaningful `<title>` tag.
- Correct heading hierarchy (`h1` > `h2`).
- `alt` attributes on all `<img>` elements.

### Accessibility (a11y)

- ARIA roles (`role="banner"`, `role="main"`, `role="search"`, `role="list"`, `role="listitem"`, `role="dialog"`).
- `aria-label` on interactive elements (buttons, inputs, links).
- `aria-live="polite"` on the toast container and empty-state message for screen reader announcements.
- `aria-modal="true"` and `aria-hidden` toggling on the modal overlay.
- `aria-labelledby` linking modal to its title.
- `.sr-only` utility class for screen-reader-only content.
- Full keyboard navigation: `Escape` closes the modal, `Tab` cycles through form fields, `:focus-visible` outlines on all interactive elements.

### Responsiveness

- Mobile-first CSS architecture.
- Responsive grid: 1 column (mobile) &rarr; 2 columns (tablet `768px`) &rarr; 3 columns (desktop `1024px`).
- Fluid toolbar layout: stacks vertically on mobile, horizontal row on tablet and above.
- Modal scrolls vertically on small screens with `max-height: 90vh`.

### Performance

- `loading="lazy"` on product images for deferred loading below the fold.
- `<link rel="preconnect">` for Google Fonts to reduce DNS/TLS latency.
- `font-display: swap` via the Google Fonts URL.
- Zero runtime dependencies -- no JavaScript libraries loaded at runtime.
- CSS `will-change` free -- animations use `transform` and `opacity` only (GPU-composited properties).
- Minimal reflows: card updates target only the affected DOM node via `replaceWith()` instead of re-rendering the entire grid.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or newer)
- [Git](https://git-scm.com/)

### Clone & Run

```bash
# 1. Clone the repository
git clone https://github.com/Nathan-SWE/acadia.git

# 2. Navigate to the project directory
cd acadia

# 4. Start VS Code Live Server
# Simply open index.html and click "Go Live"
```

> No build step required. The `public/` folder is served directly as static files.

### Project Structure

```
├── 📁 assets
│   ├── 📁 css
│   │   ├── 🎨 card.css
│   │   ├── 🎨 header.css
│   │   ├── 🎨 modal.css
│   │   ├── 🎨 reset.css
│   │   ├── 🎨 search.css
│   │   ├── 🎨 style.css
│   │   ├── 🎨 toast.css
│   │   └── 🎨 variables.css
│   └── 📁 js
│       ├── 📁 components
│       │   └── 📄 ProductCard.js
│       ├── 📁 utils
│       │   ├── 📄 format.js
│       │   ├── 📄 sanitize.js
│       │   └── 📄 toast.js
│       ├── 📄 main.js
│       └── 📄 state.js
├── 📁 public
│   ├── 📁 docs
│   │   ├── 🖼️ desktop-view.webp
│   │   └── 🖼️ mbile-view.webp
│   └── 📁 images
│       ├── 🖼️ product-1.webp
│       ├── 🖼️ product-2.webp
│       └── 🖼️ product-3.webp
├── 📝 README.md
└── 🌐 index.html
```

---

## Technical Documentation

### 1. Overview

Acadia Product Grid is a single-page client-side application that simulates an e-commerce product catalog. It allows the user to browse, search, and manage products in a visual grid, add or remove items from a cart, and create new products through a form-based modal interface. The application runs entirely in the browser with no server-side processing.

### 2. Functional Requirements

#### FR-01 -- Product Listing

The system shall render an initial set of products in a responsive grid layout upon page load. Each product is displayed as a card containing its image, title, description, and price.

#### FR-02 -- Add to Cart / Remove from Cart

The system shall allow the user to toggle the cart status of any product by clicking the action button on its card. The button label shall update to reflect the current state ("Add to Cart" or "Added"), and the cart counter in the header shall be updated in real time.

#### FR-03 -- Real-Time Search Filter

The system shall provide a search input field that filters the visible product cards as the user types. The filter is applied against the product title. When no products match the search query, an empty-state message shall be displayed.

#### FR-04 -- Product Creation via Modal

The system shall present a modal dialog when the user clicks the "Add Product" button. The modal form shall contain the following fields:

| Field         | Type            | Validation                                |
| ------------- | --------------- | ----------------------------------------- |
| Product Name  | `text`          | Required, max 80 characters               |
| Description   | `textarea`      | Required, max 200 characters              |
| Price (USD)   | `number`        | Required, must be greater than 0          |
| Product Image | `file` or `url` | Required, one of the two must be provided |

The image field provides two input modes, switchable via tabs:

- **Upload File**: accepts image files via click or drag-and-drop, reads them as Base64 via `FileReader`.
- **Paste URL**: accepts an external image URL with live preview.

Upon successful submission, a new product card is appended to the grid with a slide-in animation, the modal is closed, and a toast notification confirms the action.

#### FR-05 -- Toast Notifications

The system shall display temporary toast notifications (duration: 2.5 seconds) at the bottom-right corner of the viewport to confirm user actions such as adding/removing products from the cart and creating new products.

#### FR-06 -- Image Preview

The modal form shall display a live preview of the selected image (either uploaded file or pasted URL). The user may remove the preview to select a different image.

### 3. Non-Functional Requirements

#### NFR-01 -- Performance

- The application shall load without any JavaScript bundling or compilation step.
- Images shall use native lazy loading (`loading="lazy"`) to defer off-screen resources.
- DOM updates shall be scoped to the minimum necessary nodes (single-card replacement via `replaceWith()` rather than full grid re-render on cart toggle).
- All CSS animations shall use compositor-friendly properties only (`transform`, `opacity`).

#### NFR-02 -- Security

- All user-provided text content (product name, description) shall be sanitized through HTML entity escaping before being injected into the DOM, preventing Cross-Site Scripting (XSS) attacks.
- The sanitization module replaces the characters `&`, `<`, `>`, `"`, and `'` with their respective HTML entities.

#### NFR-03 -- Accessibility

- The application shall conform to WAI-ARIA authoring practices for interactive components (modal dialog, live regions, search landmark).
- All interactive elements shall be reachable and operable via keyboard.
- The modal shall trap visual focus by applying `overflow: hidden` on the body and shall dismiss on `Escape` key press.
- Dynamic content changes (toast messages, empty-state) shall be announced to assistive technologies via `aria-live` regions.

#### NFR-04 -- Responsiveness

- The layout shall adapt to three breakpoints: mobile (default, single column), tablet (768px, two columns), and desktop (1024px, three columns).
- The modal shall remain usable on small viewports by constraining its height to `90vh` with vertical scrolling.

#### NFR-05 -- Maintainability

- The codebase shall follow modular architecture, with each logical unit (state management, rendering, utilities, component styles) isolated in its own file.
- CSS shall follow the BEM naming convention to prevent class name collisions and improve readability.
- All design values (colors, spacing, typography, radii, shadows) shall be centralized in CSS custom properties, enabling theme changes from a single file.
- JavaScript shall use ES6 module syntax (`import`/`export`) for explicit dependency graphs between files.

#### NFR-06 -- Browser Compatibility

- The application targets modern evergreen browsers (Chrome, Firefox, Safari, Edge) in their latest two major versions.
- CSS features used: Custom Properties, `aspect-ratio`, `backdrop-filter`, `inset`, Flexbox, CSS Grid.
- JavaScript features used: ES6 Modules, `const`/`let`, arrow functions, template literals, `Intl.NumberFormat`, `FileReader`, `classList`, `dataset`.

---
