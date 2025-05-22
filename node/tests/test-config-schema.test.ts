import { describe, it, expect } from 'vitest';
import { 
  validateTestConfig, 
  TestConfigSchema,
  TestTypeEnum,
  LanguageEnum
} from './test-config-schema';
import { v4 as uuidv4 } from 'uuid';

describe('Test Configuration Schema', () => {
  it('should validate a complete test configuration', () => {
    const validConfig = {
      version: '1.0.0',
      name: 'Comprehensive Test Suite',
      description: 'Full system test configuration',
      global_environment: {
        name: 'development',
        variables: { 
          'NODE_ENV': 'test',
          'DEBUG': 'true'
        },
        requires_docker: false,
        requires_network: true
      },
      test_cases: [
        {
          id: uuidv4(),
          name: 'Basic Unit Test',
          description: 'A simple unit test case',
          type: 'unit',
          language: 'typescript',
          timeout: 10,
          skip: false
        }
      ],
      tags: ['regression', 'smoke'],
      required_services: ['database', 'cache']
    };

    expect(() => validateTestConfig(validConfig)).not.toThrow();
  });

  it('should reject invalid test configurations', () => {
    const invalidConfigs = [
      // Missing required fields
      { 
        version: '1.0.0', 
        name: 'Incomplete Config' 
      },
      // Invalid test case
      {
        version: '1.0.0',
        name: 'Invalid Test Case',
        test_cases: [
          {
            name: 'Bad Test',
            type: 'invalid_type', // Invalid test type
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
            timeout: 5000 // Too long timeout
          }
        ]
      }
    ];

    invalidConfigs.forEach(config => {
      expect(() => validateTestConfig(config)).toThrow();
    });
  });

  it('should support multiple programming languages', () => {
    const multiLanguageConfig = {
      version: '1.0.0',
      name: 'Multi-Language Test Suite',
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

    expect(() => validateTestConfig(multiLanguageConfig)).not.toThrow();
  });
});

// Install uuid for generating test UUIDs