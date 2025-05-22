#!/bin/bash

# Test Configuration Validation Script for CI/CD

set -e

# Find all test configuration files
CONFIG_FILES=$(find . -name "*test-config.json")

# Validate each configuration file
for config in $CONFIG_FILES; do
  echo "Validating configuration: $config"
  npx ts-node node/tests/test-config-validator.ts "$config"
done

echo "All test configurations validated successfully!"