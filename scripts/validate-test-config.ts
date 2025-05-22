#!/usr/bin/env node
import { TestConfigValidator } from '../node/tests/test-config-validator';
import { readFileSync } from 'fs';
import { join } from 'path';

// Function to validate test configurations in a directory
function validateTestConfigs(directory: string) {
  const validator = new TestConfigValidator();
  const configFiles = [
    'node/tests/example-test-config.json',
    // Add more config file paths as needed
  ];

  configFiles.forEach(filePath => {
    try {
      console.log(`Validating ${filePath}...`);
      const config = JSON.parse(readFileSync(join(process.cwd(), filePath), 'utf-8'));
      validator.validate(config);
      console.log(`✅ ${filePath} is valid`);
    } catch (error) {
      console.error(`❌ ${filePath} is invalid:`);
      if (error instanceof Error) {
        console.error(error.message);
      }
      process.exit(1);
    }
  });
}

// Run validation
validateTestConfigs(process.cwd());