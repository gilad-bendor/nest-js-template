# nest-js-template

A modern Nest.js application built with Bun and TypeScript.

## Features

- ⚡ **Bun Runtime** - Ultra-fast JavaScript runtime
- 🏗️ **Nest.js Framework** - Scalable Node.js server-side applications
- 📘 **TypeScript** - Full type safety and modern JavaScript features
- 🔍 **Type Checking** - Real-time TypeScript error detection
- 🧪 **Testing Ready** - Pre-configured testing setup
- 🔥 **Hot Reload** - Development server with watch mode

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your system

### Installation

```bash
# Install dependencies
bun install
```

### Development

```bash
# Start development server with hot reload
bun run start:dev

# Start with type checking
bun run dev

# Type check only (watch mode)
bun run typecheck:watch
```

### Production

```bash
# Build the application
bun run build

# Start production server
bun run start:prod
```

### Testing

```bash
# Run tests
bun run test

# Run tests in watch mode
bun run test:watch

# Run e2e tests
bun run test:e2e
```

## Project Structure

```
src/
├── main.ts          # Application entry point
├── app.module.ts    # Root module
├── app.controller.ts # Root controller
└── app.service.ts   # Root service

test/
└── app.e2e-spec.ts  # End-to-end tests
```

## Available Scripts

- `bun run start:dev` - Start development server with hot reload
- `bun run dev` - Start with type checking + hot reload
- `bun run build` - Build for production
- `bun run start:prod` - Start production server
- `bun run typecheck` - Run TypeScript type checking
- `bun run typecheck:watch` - Run type checking in watch mode
- `bun run test` - Run unit tests
- `bun run test:e2e` - Run end-to-end tests

## API Endpoints

- `GET /` - Hello World message
- `GET /health` - Health check endpoint

## Environment Variables

Configure `.env` as needed:

```env
PORT=10000
NODE_ENV=development
```
