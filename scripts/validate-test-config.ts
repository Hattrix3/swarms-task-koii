#!/usr/bin/env node

import { TestConfigValidator } from '../node/tests/test-config-validator';
import { glob } from 'glob';
import { join } from 'path';

async function validateTestConfigurations() {
  const validator = new TestConfigValidator();
  const configFiles = await glob.sync('**/*.test-config.json');
  
  const validationResults = configFiles.map(file => {
    try {
      validator.validateFile(file);
      return { file, valid: true, error: null };
    } catch (error) {
      return { 
        file, 
        valid: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  });

  const failedValidations = validationResults.filter(result => !result.valid);

  if (failedValidations.length > 0) {
    console.error('Test Configuration Validation Failed:');
    failedValidations.forEach(result => {
      console.error(`- ${result.file}: ${result.error}`);
    });
    process.exit(1);
  }

  console.log('All test configurations are valid.');
  process.exit(0);
}

validateTestConfigurations();