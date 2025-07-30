// Ultra-optimized esbuild configuration for minimal bundle size

// Modern browser targets for minimal polyfills
const modernTargets = [
  'es2022',
  'chrome91',
  'firefox90', 
  'safari15',
  'edge91'
];

// Base configuration with aggressive optimizations
const baseConfig = {
  bundle: true,
  minify: true,
  minifyWhitespace: true,
  minifyIdentifiers: true,
  minifySyntax: true,
  treeShaking: true,
  target: modernTargets,
  platform: 'browser',
  external: ['react', 'react-dom'],
  
  // Aggressive size optimizations
  drop: ['console', 'debugger'],
  legalComments: 'none',
  keepNames: false,
  mangleProps: /^_/,
  
  // Modern JS features for smaller output
  supported: {
    'dynamic-import': true,
    'import-meta': true,
    'top-level-await': true,
  },
  
  // Optimize for production
  define: {
    'process.env.NODE_ENV': '"production"',
    '__DEV__': 'false',
  },
};

export {
  baseConfig,
  modernTargets,
};