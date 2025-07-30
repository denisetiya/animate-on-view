# Development Workflow

This document outlines the development workflow and quality tools setup for the React Scroll Animation Library.

## Quality Tools Setup

### ESLint & Prettier
- **ESLint**: Configured with TypeScript, React, and Prettier integration
- **Prettier**: Code formatting with consistent style rules
- **Integration**: ESLint runs Prettier as a rule to ensure consistent formatting

### Pre-commit Hooks (Husky)
- **Pre-commit**: Runs lint-staged to check and fix code before commits
- **Commit-msg**: Validates commit messages using conventional commit format
- **Lint-staged**: Automatically fixes ESLint and Prettier issues on staged files

### Semantic Release
- **Automated versioning**: Based on conventional commits
- **Changelog generation**: Automatic changelog updates
- **GitHub releases**: Automated release creation
- **NPM publishing**: Automatic package publishing

### GitHub Actions CI/CD
- **CI Pipeline**: Runs on push/PR to main branches
  - Tests across Node.js versions (18.x, 20.x, 22.x)
  - Type checking with TypeScript
  - Linting and formatting checks
  - Test coverage reporting
  - Bundle size verification
- **Release Pipeline**: Automated releases on main branch
- **Security**: CodeQL analysis for security vulnerabilities

### Code Coverage & Quality Gates
- **Coverage thresholds**: 80% minimum for branches, functions, lines, statements
- **Quality checks**: Combined script for all quality validations
- **Bundle size monitoring**: Automated size checking and reporting

## Available Scripts

### Development
```bash
npm run dev                 # Start test watcher
npm run test               # Run tests once
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run tests with coverage report
```

### Code Quality
```bash
npm run lint               # Check for linting errors
npm run lint:fix           # Fix linting errors automatically
npm run format             # Format code with Prettier
npm run format:check       # Check if code is properly formatted
npm run typecheck          # Run TypeScript type checking
npm run quality:check      # Run all quality checks
```

### Build & Release
```bash
npm run build              # Build the library
npm run build:prod         # Production build
npm run build:analyze      # Build with bundle analyzer
npm run build:size         # Show bundle sizes
npm run build:gzip         # Show gzipped bundle sizes
npm run size-limit         # Check bundle size limits
npm run release            # Create a release (CI only)
npm run release:dry        # Dry run release
```

## Commit Message Format

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test additions or modifications
- `chore`: Build process or auxiliary tool changes
- `ci`: CI configuration changes

### Examples
```
feat: add fade animation support
fix: resolve intersection observer memory leak
docs: update API documentation
test: add unit tests for animation utils
```

## Pre-commit Workflow

When you commit code, the following happens automatically:

1. **Lint-staged** runs on staged files:
   - ESLint fixes any auto-fixable issues
   - Prettier formats the code
   - Files are re-staged if modified

2. **Commit message validation**:
   - Ensures commit follows conventional commit format
   - Rejects commits with invalid messages

## CI/CD Workflow

### Pull Requests
- All quality checks must pass
- Tests must pass across all Node.js versions
- Code coverage must meet thresholds
- Bundle size must be within limits

### Main Branch
- Automatic release creation based on commit messages
- Semantic versioning (major.minor.patch)
- Changelog generation
- NPM package publishing
- GitHub release creation

## Quality Gates

The following quality gates are enforced:

### Code Coverage
- **Branches**: 80% minimum
- **Functions**: 80% minimum  
- **Lines**: 80% minimum
- **Statements**: 80% minimum

### Bundle Size
- **Target**: Under 15KB gzipped
- **Current**: ~8.36KB gzipped ✅

### Code Quality
- No ESLint errors
- Consistent Prettier formatting
- TypeScript type checking passes
- All tests pass

## Development Best Practices

### Code Style
- Use TypeScript for all new code
- Follow the established ESLint configuration
- Write comprehensive tests for new features
- Keep bundle size minimal

### Testing
- Write unit tests for utilities and hooks
- Write integration tests for components
- Include edge cases and error scenarios
- Maintain high test coverage

### Documentation
- Update API documentation for new features
- Include examples in documentation
- Update CHANGELOG.md for notable changes
- Write clear commit messages

## Troubleshooting

### Pre-commit Hooks Not Running
```bash
npx husky install
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

### ESLint/Prettier Conflicts
The configuration is set up to avoid conflicts, but if issues arise:
```bash
npm run lint:fix
npm run format
```

### Failed CI Builds
Check the GitHub Actions logs for specific failures:
- Test failures: Fix failing tests
- Linting errors: Run `npm run lint:fix`
- Type errors: Run `npm run typecheck`
- Coverage issues: Add more tests

### Release Issues
Releases are automated based on commit messages. Ensure:
- Commits follow conventional commit format
- All CI checks pass
- You have proper permissions for NPM publishing