import { pathToFileURL } from "url";
import { validate_config } from "./config_validation.js";
import { CONFIG_LOCATIONS, PARSED_PARAMETERS } from "../constants.js";

/**
 * Loads the configuration file from multiple possible locations in order of priority.
 * Searches through CLI arguments, project root, and user home directory.
 * 
 * @async
 * @param {string[]} config_locations - The configuration locations, first valid location will be used
 * @returns {Promise<object>} - The loaded configuration object
 * @throws {Error} - When no valid configuration file could be found at any location
 */
async function load_config (config_locations) {
  for (const config_path of config_locations) {
    if (!config_path) continue;

    try {
      const config = await import(config_path);
      return config.default;
    } catch (error) {
      console.error(`Error loading configuration from ${config_path}:`, error.message);
      continue; // Try next location.
    }
  }
  throw new Error("No valid configuration file found.");
}

/**
 * Asynchronously loads and validates the configuration. prioritizing
 * the path specified via the '-c' CLI parameter, followed by default locations.
 * After successfully loading the configuration, it validates it using `validate_config`.
 *
 * @async
 * @returns {Promise<object>} A promise that resolves to the validated configuration object.
 * @throws {Error} Throws an error if no valid configuration file can be found or if the configuration fails validation.
 */
export async function load_config_helper () {
  const config = await load_config([
    PARSED_PARAMETERS["-c"] ? pathToFileURL(PARSED_PARAMETERS["-c"]).href : undefined,
    ...CONFIG_LOCATIONS
  ]);
  validate_config(config);
  return config;
}