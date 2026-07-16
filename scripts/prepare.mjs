#!/usr/bin/env node
import { execSync } from 'child_process';
import { env } from 'process';

// Skip if we're already in a prepare script to avoid recursion
if (env.PREPARING_OPENAPI_TYPESCRIPT) {
  console.log('✅ Already preparing, skipping recursive call');
  process.exit(0);
}

try {
  // Set environment variable to prevent recursion
  env.PREPARING_OPENAPI_TYPESCRIPT = '1';
  
  // Check if pnpm is available
  execSync('pnpm --version', { stdio: 'ignore' });
  console.log('📦 Using pnpm to install monorepo dependencies...');
  execSync('pnpm install --no-frozen-lockfile', { stdio: 'inherit' });
  console.log('🔨 Building packages...');
  execSync('pnpm run build', { stdio: 'inherit' });
} catch {
  console.log('⚠️  pnpm not found, installing globally...');
  try {
    execSync('npm install -g pnpm@10.30.3', { stdio: 'inherit' });
    console.log('📦 Installing monorepo dependencies with pnpm...');
    env.PREPARING_OPENAPI_TYPESCRIPT = '1';
    execSync('pnpm install --no-frozen-lockfile', { stdio: 'inherit' });
    console.log('🔨 Building packages...');
    execSync('pnpm run build', { stdio: 'inherit' });
  } catch (err) {
    console.error('❌ Failed to prepare monorepo');
    process.exit(1);
  }
}

console.log('✅ Monorepo prepared successfully');
