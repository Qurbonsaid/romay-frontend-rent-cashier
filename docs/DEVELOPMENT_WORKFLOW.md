# Development Workflow

This document describes the development workflow for the Romay project.

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

## Code Quality

### Formatting

Prettier is used to format code automatically. It runs on commit via Husky and lint-staged.

To format code manually:

```
npm run format
```

### Linting

ESLint is used to catch potential issues in the code. It runs on commit via Husky and lint-staged.

To lint code manually:

```
npm run lint
```

To lint and fix issues automatically:

```
npm run lint:fix
```

### Testing

Jest and React Testing Library are used for testing.

To run tests:

```
npm run test
```

### Git Hooks

Husky is used to manage git hooks:

- `pre-commit`: Runs lint-staged to format and lint staged files
- `commit-msg`: Validates commit messages (if configured)

## Folder Structure

See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for details on the project structure.

## Adding New Components

1. Create a new component in the appropriate directory under `src/components/`
2. If it's a UI component, place it in `src/components/ui/`
3. Export the component from `src/components/index.ts` (if applicable)
4. Add stories for the component in Storybook (if applicable)
5. Write tests for the component

## Adding New Pages

1. Create a new page component in the appropriate role directory under `src/app/`
2. Add a route for the page in `src/app/router.tsx`
3. Add navigation to the page in the appropriate layout component

## Styling

Tailwind CSS v4 is used for styling. Custom CSS variables are defined in `src/index.css`.

To add new styles:

1. Use Tailwind classes when possible
2. Add custom CSS variables to `src/index.css` if needed
3. Create new utility classes in `src/index.css` if needed

## Dependencies

### Adding New Dependencies

To add a new dependency:

```
npm install package-name
```

To add a new development dependency:

```
npm install -D package-name
```

### Updating Dependencies

To update dependencies:

```
npm update
```

## Building

To build the application for production:

```
npm run build
```

To preview the production build:

```
npm run preview
```

## Deployment

Deployment instructions will be added here when available.
