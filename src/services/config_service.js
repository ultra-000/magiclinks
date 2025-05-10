import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { isPaired } from "../utils/utils.js";
import { select } from "@inquirer/prompts";
import { CONFIG_LOCATIONS, PACKAGE_ROOT, PARSED_PARAMETERS, PROCESS_CWD, DEFAULT_CONFIG_PATH } from "../constants.js";

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
  const original_dist_dir = path.normalize(config.dist_dir);
  config.dist_dir = PARSED_PARAMETERS["-o"] ? path.normalize(PARSED_PARAMETERS["-o"]) : original_dist_dir;

  config.exclude.push(original_dist_dir + "/**", config.dist_dir + "/**"); // TODO: Make it beautiful!
  return config;
}

export async function overwrite_or_merge_raw_config (source_config, target_config, overwrite = false) { // I think this could benefit from some optimization.
  function find_entery_index (lines) {
    const entery = /export\s+default/;
    for (let i = 0; i < lines.length; i++) {
      if (entery.test(lines[i])) {
        return i;
      }
    }

    return -1;
  }

  function determine_exit_index (lines, entery_index) {
    for (let i = entery_index; i < lines.length + 1; i++) {
      if (isPaired(lines.slice(entery_index, i + 1).join(""))) {
        return i + 1;
      }
    }

    return -1;
  }

  const source_lines = (await fs.promises.readFile(source_config, { encoding: "utf-8" })).split("\n");
  const target_lines = (await fs.promises.readFile(target_config, { encoding: "utf-8" })).split("\n");
  
  const source_entery_index = find_entery_index(source_lines);
  const target_entery_index = find_entery_index(target_lines);
  const source_exit_index = determine_exit_index(source_lines, source_entery_index);
  const target_exit_index = determine_exit_index(target_lines, target_entery_index);

  if (source_entery_index === -1) {
    console.error(`Invalid source configuration file: ${source_config}\nNo default export statement found.`);
    process.exit(1);
  } else if (target_entery_index === -1) {
    console.error(`Invalid target configuration file: ${target_config}\nNo default export statement found.`);
    process.exit(1);
  }

  if (source_exit_index === -1 && !/\}.*/.test(target_lines[target_entery_index])) {
    console.error(`Invalid source configuration file: ${target_config}\nMake sure to close the default export statement.`);
    process.exit(1);
  } else if (target_exit_index === -1 && !/\}.*/.test(target_lines[target_entery_index])) {
    console.error(`Invalid target configuration file: ${target_config}\nMake sure to close the default export statement.`);
    process.exit(1);
  }
  
  const one_liner = /export\s+default\s*\{.*\}/.test(target_lines[target_entery_index]);
  const start_portion = target_lines.slice(0, target_entery_index + (one_liner ? /\}.*export\s+default/.test(target_lines[target_entery_index]) ? 1 : 0 : 1));
  const target_portion = source_lines.slice(source_entery_index + (one_liner ? 0 : 1), source_exit_index - (one_liner ? 0 : 1));
  const end_portion = target_lines.slice(target_exit_index - (one_liner ? 0 : 1));

  if (overwrite) {
    await fs.promises.writeFile(target_config, [...start_portion, ...target_portion, ...end_portion].join("\n"), { encoding: "utf-8" });
  }
}

export async function initialize_default_config () {
  let answer = "";
  let target_config = path.resolve(path.join(process.env.HOME, ".magiclinks.config.js") === path.join(PROCESS_CWD, ".magiclinks.config.js") ? ".magiclinks.config.js" : "magiclinks.config.js");
  const query = {
    default: "cancel",
    choices: [
      {
        name: "cancel",
        value: "cancel"
      },
      {
        name: "overwrite",
        value: "overwrite"
      }
    ]
  }


  if (fs.existsSync(target_config)) {
    answer = await select({
      ...query,
      message: `Warning:${target_config === ".magiclinks.config.js" ? " a global" : ""} configuartion file found at the current directory, do you want to overwrite it with the default config?`
    });
  }

  if (answer === "cancel") {
    console.info("Exiting...");
    process.exit(0);
  } else if (answer === "overwrite" || answer === "merge") {
    try {
      await overwrite_or_merge_raw_config(DEFAULT_CONFIG_PATH, target_config, answer === "overwrite");
      console.info(`${answer === "overwrite" ? "Overwritten" : "Merged"} ${target_config} with default configuration file.`);
      process.exit(0);
    } catch (error) {
      console.error(`Error while ${answer === "overwrite" ? "overwriting" : "merging"} default configuration file: ${error.message}`);
      process.exit(1);
    }
  }
  

  const default_config = await fs.promises.readFile(DEFAULT_CONFIG_PATH).catch((error) => {
    console.error(`Error reading default configuration file:`, error.message);
    process.exit(1);
  });

  if (!answer) { // No conflicting file, we are safe to continue.
    await fs.promises.writeFile(target_config, default_config, {
      encoding: "utf-8"
    }).then(() => {
      console.info(`Initialized a default configuration file at: ${target_config}`);
      process.exit(0);
    }).catch((error) => {
      console.error(`Error writing to ${target_config}:`, error.message);
      process.exit(1);
    });
  }
}

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