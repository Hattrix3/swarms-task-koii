#!/usr/bin/env node
import { TestConfigValidator } from '../node/tests/test-config-validator';
import { glob } from 'glob';
import { join } from 'path';

async function validateTestConfigs() {
  const validator = new TestConfigValidator();
  const configFiles = await glob.sync('**/*.test-config.json');

  console.log('Validating test configuration files...');

  const failedConfigs: string[] = [];

  for (const file of configFiles) {
    try {
      validator.validateFile(join(process.cwd(), file));
      console.log(`✓ ${file} is valid`);
    } catch (error) {
      console.error(`✗ ${file} is invalid`);
      console.error(error);
      failedConfigs.push(file);
    }
  }

  if (failedConfigs.length > 0) {
    console.error(`\n${failedConfigs.length} test configuration(s) failed validation`);
    process.exit(1);
  }

  console.log('All test configurations are valid.');
}

validateTestConfigs();