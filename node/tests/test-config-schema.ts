import { z } from 'zod';

// Enum for supported test types
export const TestTypeEnum = z.enum([
  'unit', 
  'integration', 
  'e2e', 
  'performance', 
  'security'
]);

// Enum for supported programming languages
export const LanguageEnum = z.enum([
  'typescript', 
  'python', 
  'javascript', 
  'shell'
]);

// Test environment configuration
const TestEnvironmentSchema = z.object({
  name: z.string().min(1).max(50),
  variables: z.record(z.string(), z.string()).optional(),
  requires_docker: z.boolean().default(false),
  requires_network: z.boolean().default(false)
});

// Individual test case schema
const TestCaseSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  type: TestTypeEnum,
  language: LanguageEnum,
  dependencies: z.array(z.string()).optional(),
  timeout: z.number().min(0).max(3600).default(30), // seconds
  skip: z.boolean().default(false),
  only: z.boolean().default(false)
});

// Test suite configuration schema
export const TestConfigSchema = z.object({
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  global_environment: TestEnvironmentSchema.optional(),
  test_cases: z.array(TestCaseSchema).min(1),
  tags: z.array(z.string()).optional(),
  required_services: z.array(z.string()).optional()
});

// Validation function
export function validateTestConfig(config: unknown) {
  try {
    return TestConfigSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Test Configuration Validation Failed:', error.errors);
      throw new Error('Invalid test configuration');
    }
    throw error;
  }
}

// Example usage function
export function createTestConfig(partialConfig: z.input<typeof TestConfigSchema>) {
  return validateTestConfig(partialConfig);
}