#!/bin/bash
set -e

# Find all test configuration files
TEST_CONFIGS=$(find . -name "*.test-config.json")

# Counter for successful/failed validations
SUCCESSFUL_VALIDATIONS=0
FAILED_VALIDATIONS=0

# Validate each configuration file
for config in $TEST_CONFIGS; do
  echo "Validating: $config"
  if npx ts-node node/tests/test-config-validator.ts validate "$config"; then
    ((SUCCESSFUL_VALIDATIONS++))
  else
    ((FAILED_VALIDATIONS++))
    echo "Validation failed for $config"
  fi
done

# Report results
echo "Validation Complete:"
echo "Successful Validations: $SUCCESSFUL_VALIDATIONS"
echo "Failed Validations: $FAILED_VALIDATIONS"

# Exit with error if any validations failed
if [ $FAILED_VALIDATIONS -gt 0 ]; then
  exit 1
fi