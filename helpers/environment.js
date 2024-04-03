/*
 * Title: Environment
 * Description: Handles all environment-related configurations
 * Author: Mehedi Hasan
 * Date: 28/02/2024
 */

// Define environments
const environments = {
    development: {
        port: 3000,
        name: "Development",
        maxChecks: 5,
    },
    production: {
        port: 4000,
        name: "Production",
        maxChecks: 5,
    },
};

// Determine current environment
const currentEnv = process.env.NODE_ENV || "development";

// Export the appropriate environment configuration
module.exports = environments[currentEnv] || environments.development;
