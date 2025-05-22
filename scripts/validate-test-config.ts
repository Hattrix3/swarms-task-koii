#!/usr/bin/env node
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { TestConfigValidator } from '../node/tests/test-config-validator';

function validateTestConfigs(directory: string) {
  const validator = new TestConfigValidator();
  const configFiles = readdirSync(directory)
    .filter(file => file.endsWith('.json'));

  const results: {[key: string]: boolean} = {};
  let hasErrors = false;

  configFiles.forEach(file => {
    const filePath = join(directory, file);
    try {
      validator.validateFile(filePath);
      results[file] = true;
      console.log(`✅ ${file}: Valid`);
    } catch (error) {
      results[file] = false;
      hasErrors = true;
      console.error(`❌ ${file}: Invalid`);
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  });

  if (hasErrors) {
    console.error('Some test configurations are invalid.');
    process.exit(1);
  }

  console.log('All test configurations are valid.');
}

// Usage: node validate-test-config.ts <directory>
const directory = process.argv[2] || 'node/tests';
validateTestConfigs(directory);