# Glowing

A modern TypeScript library for creating beautiful glowing border effects around HTML elements.

## Installation

```bash
npm install glowing
```

## Usage

```ts
import { Glowing } from 'glowing'

// Create a glowing effect around an element
const element = document.querySelector('.my-element')

const glow = new Glowing(element, options)

// Control methods
glow.show() // Show the glow effect
glow.hide() // Hide the glow effect
glow.toggle() // Toggle visibility
glow.remove() // Remove the glow effect completely
```

```ts
// Set options
glow.setOptions({
  // Animation duration in ms
  rotationDuration: 2000,
  // Glow width in pixels
  width: 4,
  // Blend mode for the glow effect
  blendMode: 'color-dodge',
  // Custom gradient colors
  colors: ['cyan', 'purple', 'tomato'],
  // Additional gradient colors
  colors2: ['white', 'transparent', 'transparent', 'white', 'transparent', 'transparent', 'white'],
  // Blur intensity of the glow
  glowingBlurRatio: 1.5,
})
```

Open [http://localhost:3000](http://localhost:3000) to see the playground.

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the package for production
- `npm test` - Run tests
- `npm run format` - Format all files using Prettier
- `npm run format:check` - Check if files are properly formatted

## TypeScript Support

This package includes TypeScript type definitions. No additional @types packages are needed.

## Browser Support

The package is built for modern browsers and includes:

- ES Modules build
- CommonJS build
- TypeScript declarations
- Source maps

## License

Apache 2.0
