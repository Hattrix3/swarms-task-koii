#!/bin/bash
set -e

# Find all test configuration files
TEST_CONFIG_FILES=$(find . -name "*.test-config.json")

# Validate each test configuration file
for config_file in $TEST_CONFIG_FILES; do
  echo "Validating test configuration: $config_file"
  npx ts-node node/tests/test-config-validator.ts validate "$config_file"
done

echo "All test configurations validated successfully."