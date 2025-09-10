# Romay Project

This is a React project built with Vite, TypeScript, Tailwind CSS v4, and shadcn/ui for the Romay system with multiple roles.

## Project Structure

See [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) for detailed information about the project structure.

## Roles

- CEO
- Manager
- Sales Department
- Warehouse

## Development

See [docs/DEVELOPMENT_WORKFLOW.md](docs/DEVELOPMENT_WORKFLOW.md) for detailed information about the development workflow.

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

### Code Quality

- Prettier for code formatting
- ESLint for linting
- Husky for git hooks
- lint-staged for running linters on staged files

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint and fix issues
- `npm run test` - Run tests
- `npm run format` - Format code with Prettier
