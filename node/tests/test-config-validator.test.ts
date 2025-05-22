import { describe, it, expect } from 'vitest';
import { v4 as uuidv4 } from 'uuid';
import { TestConfigValidator, TestConfigValidationError } from './test-config-validator';

describe('Test Configuration Validator', () => {
  const validator = new TestConfigValidator();

  it('should validate a complete test configuration', () => {
    const validConfig = {
      version: '1.0.0',
      name: 'Comprehensive Test Suite',
      languages: ['typescript', 'python'],
      test_types: ['unit', 'integration'],
      global_config: {
        environment: 'test',
        timeout: 300,
        required_services: ['database', 'cache']
      },
      test_cases: [
        {
          id: uuidv4(),
          name: 'Basic Unit Test',
          description: 'A simple unit test case',
          type: 'unit',
          language: 'typescript',
          timeout: 60
        }
      ]
    };

    expect(() => validator.validate(validConfig)).not.toThrow();
  });

  it('should reject invalid test configurations', () => {
    const invalidConfigs = [
      // Missing required fields
      { version: '1.0.0' },
      
      // Invalid test case
      {
        version: '1.0.0',
        name: 'Invalid Test Suite',
        test_cases: [
          {
            name: 'Bad Test',
            type: 'invalid_type',
            language: 'typescript'
          }
        ]
      },
      
      // Invalid timeout
      {
        version: '1.0.0',
        name: 'Timeout Test',
        test_cases: [
          {
            id: uuidv4(),
            name: 'Timeout Test Case',
            type: 'unit',
            language: 'typescript',
            timeout: 5000
          }
        ]
      }
    ];

    invalidConfigs.forEach(config => {
      expect(() => validator.validate(config)).toThrow(TestConfigValidationError);
    });
  });

  it('should support multiple languages and test types', () => {
    const multiLanguageConfig = {
      version: '1.0.0',
      name: 'Multi-Language Test Suite',
      languages: ['typescript', 'python', 'shell'],
      test_types: ['unit', 'integration', 'e2e'],
      test_cases: [
        {
          id: uuidv4(),
          name: 'TypeScript Test',
          type: 'unit',
          language: 'typescript'
        },
        {
          id: uuidv4(),
          name: 'Python Test',
          type: 'integration',
          language: 'python'
        },
        {
          id: uuidv4(),
          name: 'Shell Test',
          type: 'e2e',
          language: 'shell'
        }
      ]
    };

    expect(() => validator.validate(multiLanguageConfig)).not.toThrow();
  });
});

// Example of error reporting
it('should generate detailed error reports', () => {
  const invalidConfig = {
    version: 'invalid-version',
    name: '',
    test_cases: []
  };

  try {
    validator.validate(invalidConfig);
  } catch (error) {
    if (error instanceof TestConfigValidationError) {
      const errorReport = validator.formatErrorReport(error);
      console.log(errorReport);
      expect(errorReport).toContain('Test Configuration Validation Failed');
    }
  }
});