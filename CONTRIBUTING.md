# Contributing to React Scroll Animation Library

Thank you for your interest in contributing! This guide will help you get started with development and contribution workflows.

## Table of Contents

- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Code Style](#code-style)
- [Submitting Changes](#submitting-changes)
- [Release Process](#release-process)

## Development Setup

### Prerequisites

- Node.js 16+ 
- npm, yarn, or pnpm
- Git

### Getting Started

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/denisetiya/animate-on-view.git
   cd animate-on-view
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start development**
   ```bash
   npm run dev
   # This starts the development server and watches for changes
   ```

4. **Run tests**
   ```bash
   npm test
   # Run tests in watch mode
   npm run test:watch
   ```

## Project Structure

```
src/
├── components/           # React components
│   ├── AnimateOnView.tsx
│   ├── AnimationErrorBoundary.tsx
│   └── __tests__/
├── hooks/               # React hooks
│   ├── useScrollAnimation.ts
│   ├── useIntersectionObserver.ts
│   └── __tests__/
├── animations/          # Animation definitions
│   ├── fadeAnimations.ts
│   ├── slideAnimations.ts
│   └── __tests__/
├── utils/              # Utility functions
│   ├── animationUtils.ts
│   ├── cssUtils.ts
│   └── __tests__/
├── types/              # TypeScript definitions
│   ├── animations.ts
│   ├── components.ts
│   └── index.ts
├── context/            # React context
│   └── AnimationContext.tsx
└── index.ts            # Main entry point

docs/                   # Documentation
├── API.md
├── EXAMPLES.md
├── TROUBLESHOOTING.md
└── demo.html

__tests__/              # Integration tests
├── accessibility.test.tsx
├── ssr-integration.test.tsx
└── performance-benchmarks.test.tsx
```

## Development Workflow

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the library for production
- `npm run test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run type-check` - Run TypeScript type checking
- `npm run size-check` - Check bundle size
- `npm run docs:build` - Build documentation
- `npm run docs:serve` - Serve documentation locally

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes**
   - Write code following our [code style guidelines](#code-style)
   - Add tests for new functionality
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm run test
   npm run lint
   npm run type-check
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new animation type"
   # Follow conventional commit format
   ```

## Testing

### Test Types

1. **Unit Tests** - Test individual functions and components
2. **Integration Tests** - Test component interactions
3. **Accessibility Tests** - Ensure WCAG compliance
4. **Performance Tests** - Benchmark animation performance
5. **Browser Tests** - Cross-browser compatibility
6. **SSR Tests** - Server-side rendering compatibility

### Writing Tests

#### Component Tests
```tsx
import { render, screen } from '@testing-library/react';
import { AnimateOnView } from '../AnimateOnView';

describe('AnimateOnView', () => {
  it('should render children', () => {
    render(
      <AnimateOnView type="fade">
        <div>Test content</div>
      </AnimateOnView>
    );
    
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });
});
```

#### Hook Tests
```tsx
import { renderHook } from '@testing-library/react';
import { useScrollAnimation } from '../useScrollAnimation';

describe('useScrollAnimation', () => {
  it('should return animation state', () => {
    const { result } = renderHook(() => 
      useScrollAnimation({ type: 'fade' })
    );
    
    expect(result.current.isVisible).toBe(false);
    expect(typeof result.current.trigger).toBe('function');
  });
});
```

#### Utility Tests
```tsx
import { generateAnimationCSS } from '../animationUtils';

describe('animationUtils', () => {
  it('should generate correct CSS for fade animation', () => {
    const css = generateAnimationCSS({
      type: 'fade',
      duration: 600,
      easing: 'ease'
    });
    
    expect(css).toContain('opacity');
    expect(css).toContain('600ms');
  });
});
```

### Test Coverage

We aim for:
- **90%+ line coverage**
- **85%+ branch coverage**
- **100% coverage for critical paths**

Run coverage reports:
```bash
npm run test:coverage
```

## Code Style

### TypeScript Guidelines

1. **Use strict TypeScript configuration**
2. **Prefer interfaces over types for object shapes**
3. **Use generic types for reusable components**
4. **Export types alongside implementations**

```tsx
// Good
interface AnimationConfig {
  type: AnimationType;
  duration?: number;
}

export const useScrollAnimation = <T extends HTMLElement = HTMLElement>(
  config: AnimationConfig
): UseScrollAnimationReturn<T> => {
  // Implementation
};

// Avoid
type AnimationConfig = {
  type: any;
  duration: number | undefined;
};
```

### React Guidelines

1. **Use functional components with hooks**
2. **Prefer custom hooks for reusable logic**
3. **Use React.memo for performance optimization**
4. **Handle cleanup in useEffect**

```tsx
// Good
const AnimateOnView = React.memo<AnimateOnViewProps>(({
  children,
  type = 'fade',
  ...props
}) => {
  const { ref, isVisible } = useScrollAnimation({ type, ...props });
  
  useEffect(() => {
    // Setup
    return () => {
      // Cleanup
    };
  }, []);
  
  return (
    <div ref={ref}>
      {children}
    </div>
  );
});
```

### Performance Guidelines

1. **Minimize bundle size**
2. **Use tree-shaking friendly exports**
3. **Avoid unnecessary re-renders**
4. **Use CSS transforms for animations**

```tsx
// Good - tree-shakable exports
export { AnimateOnView } from './components/AnimateOnView';
export { useScrollAnimation } from './hooks/useScrollAnimation';

// Avoid - barrel exports that prevent tree-shaking
export * from './components';
```

### Accessibility Guidelines

1. **Respect motion preferences**
2. **Provide ARIA labels where needed**
3. **Ensure keyboard navigation works**
4. **Test with screen readers**

```tsx
// Good
const respectsMotionPreference = !window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

<div
  role="region"
  aria-label="Animated content"
  style={{
    animation: respectsMotionPreference ? 'fadeIn 0.6s' : 'none'
  }}
>
  {children}
</div>
```

## Submitting Changes

### Pull Request Process

1. **Ensure all tests pass**
   ```bash
   npm run test
   npm run lint
   npm run build
   ```

2. **Update documentation**
   - Update README.md if needed
   - Add/update API documentation
   - Include examples for new features

3. **Create pull request**
   - Use descriptive title
   - Include detailed description
   - Reference related issues
   - Add screenshots/GIFs for UI changes

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Commit Message Format

We use [Conventional Commits](https://conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build/tooling changes

**Examples:**
```
feat(animations): add flip animation support
fix(ssr): resolve hydration mismatch in Next.js
docs(api): update useScrollAnimation documentation
```

## Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Steps

1. **Update version**
   ```bash
   npm version patch|minor|major
   ```

2. **Update CHANGELOG.md**
   - Document all changes
   - Include migration guide for breaking changes

3. **Create release PR**
   - Review all changes
   - Ensure documentation is up to date

4. **Publish release**
   ```bash
   npm run build
   npm publish
   ```

5. **Create GitHub release**
   - Tag the release
   - Include release notes
   - Attach build artifacts

## Getting Help

- **Questions**: Open a [Discussion](https://github.com/denisetiya/animate-on-view/discussions)
- **Bugs**: Open an [Issue](https://github.com/denisetiya/animate-on-view/issues)
- **Security**: Email denisetiya009@gmail.com.com

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## License

By contributing, you agree that your contributions will be licensed under the MIT License.