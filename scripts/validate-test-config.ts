#!/usr/bin/env node
import { TestConfigValidator } from '../node/tests/test-config-validator';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

async function validateTestConfigs() {
  const validator = new TestConfigValidator();
  const configDir = join(__dirname, '..', 'node', 'tests');
  
  try {
    // Find all JSON files in the tests directory
    const files = await readdir(configDir);
    const jsonConfigs = files.filter(file => file.endsWith('.json'));

    console.log('Validating test configurations...');

    for (const file of jsonConfigs) {
      const filePath = join(configDir, file);
      try {
        const fileContents = await readFile(filePath, 'utf-8');
        const config = JSON.parse(fileContents);
        
        validator.validate(config);
        console.log(`✓ ${file}: Valid configuration`);
      } catch (error) {
        console.error(`✗ ${file}: Invalid configuration`);
        if (error instanceof Error) {
          console.error(error.message);
        }
        process.exit(1);
      }
    }

    console.log('All test configurations are valid.');
  } catch (error) {
    console.error('Error during test configuration validation:', error);
    process.exit(1);
  }
}

validateTestConfigs();