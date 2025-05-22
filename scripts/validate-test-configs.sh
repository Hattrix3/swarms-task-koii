#!/bin/bash
set -e

# Find all test configuration files
TEST_CONFIGS=$(find . -name "*.test-config.json")

# Validate each test configuration
for config in $TEST_CONFIGS; do
  echo "Validating test configuration: $config"
  npx ts-node node/tests/test-config-validator.ts validate "$config"
done

echo "All test configurations are valid!"