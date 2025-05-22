#!/usr/bin/env node
import { TestConfigValidator } from '../node/tests/test-config-validator';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

function validateTestConfigs(directory: string) {
  const validator = new TestConfigValidator();
  const configFiles = readdirSync(directory)
    .filter(file => file.endsWith('.json'));

  const errors: string[] = [];

  configFiles.forEach(file => {
    const filePath = join(directory, file);
    try {
      validator.validateFile(filePath);
      console.log(`✅ ${file}: Valid`);
    } catch (error) {
      console.error(`❌ ${file}: Invalid`);
      if (error instanceof Error) {
        errors.push(`${file}: ${error.message}`);
      }
    }
  });

  if (errors.length > 0) {
    console.error('Test Configuration Validation Failed:');
    errors.forEach(error => console.error(error));
    process.exit(1);
  }
}

// Run validation on test configuration directory
validateTestConfigs('./node/tests');
