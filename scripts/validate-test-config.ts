#!/usr/bin/env node
import { TestConfigValidator } from '../node/tests/test-config-validator';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

function validateTestConfigs(directory: string) {
  const validator = new TestConfigValidator();
  const configFiles = readdirSync(directory)
    .filter(file => file.endsWith('.json') && file.includes('test-config'));

  const results: {[key: string]: boolean | string} = {};

  configFiles.forEach(file => {
    const filePath = join(directory, file);
    try {
      validator.validateFile(filePath);
      results[file] = true;
    } catch (error) {
      results[file] = error instanceof Error ? error.message : 'Unknown error';
    }
  });

  return results;
}

function main() {
  const testConfigDirectory = join(__dirname, '..', 'node', 'tests');
  const validationResults = validateTestConfigs(testConfigDirectory);

  console.log('Test Configuration Validation Results:');
  Object.entries(validationResults).forEach(([file, result]) => {
    console.log(`${file}: ${result === true ? 'PASS' : `FAIL - ${result}`}`);
  });

  // Exit with non-zero status if any validation fails
  const hasFailures = Object.values(validationResults).some(result => result !== true);
  process.exit(hasFailures ? 1 : 0);
}

main();