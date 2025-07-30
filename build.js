import esbuild from 'esbuild';
import fs from 'fs';
import { execSync } from 'child_process';
import { baseConfig } from './esbuild.config.js';

// Clean dist directory
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true });
}

// Check if this is a production build
const isProduction = process.env.NODE_ENV === 'production' || process.argv.includes('--production');

// Ultra-optimized build options for minimal bundle size
const baseOptions = {
  ...baseConfig,
  entryPoints: ['src/index.ts'],
  sourcemap: !isProduction, // Skip sourcemaps in production for even smaller size
  // Additional production optimizations
  ...(isProduction && {
    drop: [...baseConfig.drop, 'console', 'debugger'],
    pure: ['console.log', 'console.warn', 'console.error'], // Mark as pure for removal
  }),
};

// Function to get file size in KB
const getFileSizeKB = (filePath) => {
  const stats = fs.statSync(filePath);
  return (stats.size / 1024).toFixed(2);
};

// Function to get gzipped size in KB
const getGzippedSizeKB = (filePath) => {
  const gzippedSize = execSync(`gzip -c "${filePath}" | wc -c`, { encoding: 'utf8' });
  return (parseInt(gzippedSize.trim()) / 1024).toFixed(2);
};

// Build ESM with size reporting
esbuild.build({
  ...baseOptions,
  format: 'esm',
  outfile: 'dist/esm/index.js',
  metafile: true,
}).then(result => {
  // Save metadata for bundle analysis
  fs.mkdirSync('dist', { recursive: true });
  fs.writeFileSync('dist/meta.json', JSON.stringify(result.metafile));
  
  // Report bundle size
  const esmPath = 'dist/esm/index.js';
  const rawSize = getFileSizeKB(esmPath);
  const gzippedSize = getGzippedSizeKB(esmPath);
  
  console.log('✅ ESM build complete');
  console.log(`📦 ESM Bundle size: ${rawSize}KB (${gzippedSize}KB gzipped)`);
  
  // Check if we're under the 15KB gzipped target
  if (parseFloat(gzippedSize) > 15) {
    console.warn(`⚠️  Bundle size ${gzippedSize}KB exceeds 15KB target`);
  } else {
    console.log(`🎯 Bundle size ${gzippedSize}KB is under 15KB target`);
  }
}).catch(() => process.exit(1));

// Build CommonJS with size reporting
esbuild.build({
  ...baseOptions,
  format: 'cjs',
  outfile: 'dist/cjs/index.js',
}).then(() => {
  const cjsPath = 'dist/cjs/index.js';
  const rawSize = getFileSizeKB(cjsPath);
  const gzippedSize = getGzippedSizeKB(cjsPath);
  
  console.log('✅ CJS build complete');
  console.log(`📦 CJS Bundle size: ${rawSize}KB (${gzippedSize}KB gzipped)`);
}).catch(() => process.exit(1));

// Generate TypeScript declarations
try {
  // Ensure types directory exists
  fs.mkdirSync('dist/types', { recursive: true });
  execSync('tsc --emitDeclarationOnly --outDir dist/types --noEmit false', { stdio: 'inherit' });
  console.log('✅ TypeScript declarations generated');
} catch (error) {
  console.error('❌ TypeScript declaration generation failed');
  process.exit(1);
}