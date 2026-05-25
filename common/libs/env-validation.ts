/**
 * Environment validation utilities for startup configuration
 * Ensures critical environment variables are present before application starts
 */

interface RequiredEnvVar {
  name: string;
  description: string;
}

const REQUIRED_ENV_VARS: RequiredEnvVar[] = [
  {
    name: 'NEXTAUTH_SECRET',
    description: 'NextAuth.js secret for JWT signing and encryption'
  }
];

/**
 * Validates that all required environment variables are present
 * Throws an error with clear message if any critical variables are missing
 */
export function validateRequiredEnvVars(): void {
  const missingVars: RequiredEnvVar[] = [];

  for (const envVar of REQUIRED_ENV_VARS) {
    const value = process.env[envVar.name];
    if (!value || value.trim() === '') {
      missingVars.push(envVar);
    }
  }

  if (missingVars.length > 0) {
    const errorMessage = [
      '❌ Critical environment variables are missing:',
      '',
      ...missingVars.map(v => `  • ${v.name}: ${v.description}`),
      '',
      'Please set these environment variables before starting the application.',
      'Check your .env.local file or deployment configuration.'
    ].join('\n');

    throw new Error(errorMessage);
  }
}

/**
 * Validates a specific environment variable
 * @param name - Environment variable name
 * @param description - Human-readable description for error messages
 */
export function validateEnvVar(name: string, description: string): string {
  const value = process.env[name];
  if (!value || value.trim() === '') {
    throw new Error(
      `❌ Missing required environment variable: ${name}\n` +
      `   Description: ${description}\n` +
      `   Please set this variable in your .env.local file or deployment configuration.`
    );
  }
  return value;
}