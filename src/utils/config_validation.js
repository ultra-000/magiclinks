import { extract_dirs_from_glob } from "./glob_utils.js";

/**
 * Validates the configuration object based on predefined rules.
 * @param {object} config - The configuration object to validate.
 * @returns {void}
 */
export function validate_config(config) {
    const validation_rules = {
      links: {
        validate: value => !Array.isArray(value) && typeof value === "object",
        message: "`links` must be an object"
      },
      src_dirs: {
        validate: Array.isArray,
        message: "`src_dirs` must be an array"
      },
      dist_dir: {
        validate: value => typeof value === "string" && value.length && value !== "." && value !== "./",
        message: "No output directory specified or `dist_dir` must be a valid destination"
      },
      exclude: {
        validate: Array.isArray,
        message: "`exclude` must be an array"
      },
      watch: {
        validate: value => typeof value === "boolean",
        message: "`watch` must be a boolean"
      },
    };
  
    for (const [key, rule] of Object.entries(validation_rules)) {
      if (!rule.validate(config[key])) {
        console.error(`Invalid configuration: ${rule.message}`);
        process.exit(1);
      }
    }
}