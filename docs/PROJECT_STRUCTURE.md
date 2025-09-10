# Project Structure

This document outlines the folder and code structure of the Romay project.

## Folder Structure

```
src/
├── app/                    # Main application directory
│   ├── ceo/               # CEO specific components and pages
│   ├── manager/           # Manager specific components and pages
│   ├── sales/             # Sales Department specific components and pages
│   ├── warehouse/         # Warehouse specific components and pages
│   ├── home.tsx          # Home page component
│   └── router.tsx        # Main router configuration
├── components/           # Shared components
│   ├── ui/               # UI components (shadcn/ui)
│   │   ├── button.tsx
│   │   └── button-variants.ts
│   ├── layout.tsx        # Main layout component
│   └── dashboard.tsx     # Dashboard component
├── lib/                  # Utility functions and helpers
│   └── utils.ts
├── hooks/                # Custom hooks
├── types/                # TypeScript types
├── assets/               # Static assets
└── ...
```

## Code Structure

### Main Entry Points

- `src/main.tsx` - Application entry point
- `src/App.tsx` - Main application component
- `src/app/router.tsx` - Router configuration

### Component Organization

Components are organized by role and functionality:

1. **Role-based components**: Each role (CEO, Manager, Sales, Warehouse) has its own directory under `src/app/`
2. **Shared components**: Reusable components are placed in `src/components/`
3. **UI components**: shadcn/ui components are in `src/components/ui/`

### Styling

- Tailwind CSS v4 is used for styling
- Custom CSS variables are defined in `src/index.css`
- shadcn/ui components use CSS variables for theming

### Routing

The application uses React Router for navigation:

- `/` - Home page with role selection
- `/ceo/*` - CEO dashboard and related pages
- `/manager/*` - Manager dashboard and related pages
- `/sales/*` - Sales Department dashboard and related pages
- `/warehouse/*` - Warehouse dashboard and related pages

### Code Quality

- Prettier for code formatting
- ESLint for linting
- Husky for git hooks
- lint-staged for running linters on staged files
- Jest for testing

### Testing

- Tests are colocated with the components they test
- Test utilities are in `src/setupTests.ts`
- Jest configuration is in `jest.config.js`
