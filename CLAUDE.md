# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Nest.js application template built with Bun runtime and TypeScript. The project uses modern tooling and follows Nest.js conventions for scalable Node.js server-side applications.

## Development Commands

### Core Development
- `bun run start:dev` - Start development server with hot reload
- `bun run dev` - Start with type checking + hot reload (recommended for development)
- `bun run start:debug` - Start with debugger and hot reload

### Building and Production
- `bun run build` - Build for production (outputs to `dist/`)
- `bun run start:prod` - Start production server
- `bun run start:compiled` - Run the compiled version from `dist/`

### Code Quality
- `bun run typecheck` - Run TypeScript type checking
- `bun run typecheck:watch` - Run type checking in watch mode
- `bun run lint` - Run ESLint with auto-fix
- `bun run format` - Format code with Prettier

### Testing
- `bun test` - Run unit tests
- `bun run test:watch` - Run tests in watch mode
- `bun run test:cov` - Run tests with coverage
- `bun run test:e2e` - Run end-to-end tests
- `bun run test:debug` - Run tests with debugger

## Architecture

### Core Structure
The application follows standard Nest.js architecture:
- `src/main.ts` - Application entry point with bootstrap function
- `src/app.module.ts` - Root module that imports all other modules
- `src/app.controller.ts` - Root controller
- `src/app.service.ts` - Root service

### Configuration
- Uses Bun as the JavaScript runtime instead of Node.js
- TypeScript configuration in `tsconfig.json` with strict mode enabled
- Nest CLI configuration in `nest-cli.json` with SWC builder for fast compilation
- ESLint configuration with TypeScript support
- Environment variables loaded from `.env` file

### Key Features
- CORS enabled by default in main.ts
- Port configuration via environment variable (defaults to 10000)
- Hot reload support for development
- Type checking and linting integrated into development workflow

## Development Workflow

1. Use `bun run dev` for development (includes type checking)
2. Run `bun run typecheck` and `bun run lint` before committing changes
3. Use `bun test` to run tests during development
4. Build with `bun run build` before production deployment

## Runtime Notes

This project uses Bun instead of Node.js:
- All package management is done with `bun install`
- Scripts are executed with `bun run` commands
- The application entry point uses Bun runtime features
- TypeScript types include "bun-types" for Bun-specific APIs