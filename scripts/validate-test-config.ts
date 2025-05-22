#!/usr/bin/env node
import { TestConfigValidator } from '../node/tests/test-config-validator';
import { glob } from 'glob';
import { readFileSync } from 'fs';
import path from 'path';

async function validateTestConfigs() {
  const validator = new TestConfigValidator();
  const configFiles = await glob('**/*.test-config.json');
  
  console.log('Validating test configuration files...');
  
  const failedConfigs: string[] = [];
  
  for (const file of configFiles) {
    try {
      console.log(`Validating: ${file}`);
      validator.validateFile(file);
      console.log(`✅ ${file} - Valid`);
    } catch (error) {
      console.error(`❌ ${file} - Invalid`);
      console.error(error);
      failedConfigs.push(file);
    }
  }
  
  if (failedConfigs.length > 0) {
    console.error(`\n${failedConfigs.length} configuration file(s) failed validation.`);
    process.exit(1);
  }
  
  console.log('All test configuration files are valid.');
}

// Execute validation
validateTestConfigs().catch(error => {
  console.error('Validation script error:', error);
  process.exit(1);
});