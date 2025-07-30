#!/usr/bin/env node

import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
// Size limits
const MAX_RAW_SIZE_KB = 50;
const MAX_GZIPPED_SIZE_KB = 15;

function getFileSizeKB(filePath) {
  const stats = fs.statSync(filePath);
  return Math.round(stats.size / 1024 * 100) / 100;
}

function getGzippedSizeKB(filePath) {
  const gzippedSize = execSync(`gzip -c "${filePath}" | wc -c`, { encoding: 'utf8' });
  return Math.round(parseInt(gzippedSize.trim()) / 1024 * 100) / 100;
}

function checkBundleSize() {
  const esmPath = 'dist/esm/index.js';
  const cjsPath = 'dist/cjs/index.js';
  
  if (!fs.existsSync(esmPath) || !fs.existsSync(cjsPath)) {
    console.error('❌ Build files not found. Run npm run build first.');
    process.exit(1);
  }
  
  const esmRaw = getFileSizeKB(esmPath);
  const esmGzipped = getGzippedSizeKB(esmPath);
  const cjsRaw = getFileSizeKB(cjsPath);
  const cjsGzipped = getGzippedSizeKB(cjsPath);
  
  console.log('\n📦 Bundle Size Report');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`ESM: ${esmRaw}KB raw, ${esmGzipped}KB gzipped`);
  console.log(`CJS: ${cjsRaw}KB raw, ${cjsGzipped}KB gzipped`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Check limits (using ESM as primary target)
  const rawPass = esmRaw <= MAX_RAW_SIZE_KB;
  const gzippedPass = esmGzipped <= MAX_GZIPPED_SIZE_KB;
  
  if (rawPass && gzippedPass) {
    console.log(`✅ PASS - Bundle size within limits`);
    console.log(`   Raw: ${esmRaw}KB ≤ ${MAX_RAW_SIZE_KB}KB`);
    console.log(`   Gzipped: ${esmGzipped}KB ≤ ${MAX_GZIPPED_SIZE_KB}KB`);
  } else {
    console.log(`❌ FAIL - Bundle size exceeds limits`);
    if (!rawPass) {
      console.log(`   Raw: ${esmRaw}KB > ${MAX_RAW_SIZE_KB}KB`);
    }
    if (!gzippedPass) {
      console.log(`   Gzipped: ${esmGzipped}KB > ${MAX_GZIPPED_SIZE_KB}KB`);
    }
    process.exit(1);
  }
  
  // Show savings compared to 50KB requirement
  const savings = ((50 - esmGzipped) / 50 * 100).toFixed(1);
  console.log(`🎯 ${savings}% smaller than 50KB requirement`);
}

checkBundleSize();