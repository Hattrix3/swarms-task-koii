import Ajv from 'ajv';
import { readFileSync } from 'fs';
import { join } from 'path';

// Custom error formatter
export class TestConfigValidationError extends Error {
  constructor(message: string, public details: any[]) {
    super(message);
    this.name = 'TestConfigValidationError';
  }
}

export class TestConfigValidator {
  private ajv: Ajv;
  private schema: any;

  constructor() {
    this.ajv = new Ajv({
      allErrors: true,
      verbose: true,
      strict: true
    });

    // Load schema from file
    const schemaPath = join(__dirname, 'test-config-schema.json');
    this.schema = JSON.parse(readFileSync(schemaPath, 'utf-8'));
  }

  // Validate test configuration
  validate(config: any): boolean {
    const valid = this.ajv.validate(this.schema, config);

    if (!valid) {
      const errorDetails = this.ajv.errors?.map(error => ({
        path: error.instancePath,
        message: error.message,
        params: error.params
      })) || [];

      throw new TestConfigValidationError('Invalid test configuration', errorDetails);
    }

    return true;
  }

  // Validate file path
  validateFile(filePath: string): boolean {
    const config = JSON.parse(readFileSync(filePath, 'utf-8'));
    return this.validate(config);
  }

  // Generate human-readable error report
  formatErrorReport(error: TestConfigValidationError): string {
    const errorLines = error.details.map(detail => 
      `- ${detail.path}: ${detail.message}`
    );

    return [
      'Test Configuration Validation Failed:',
      ...errorLines
    ].join('\n');
  }
}

// Export for use in CI/CD or testing scripts
export function validateTestConfig(config: any) {
  const validator = new TestConfigValidator();
  return validator.validate(config);
}