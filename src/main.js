#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { glob } from "glob";
import { pathToFileURL } from "url";
import { CONFIG_LOCATIONS } from "./constants.js";
import parse_parameters from "./utils/parse_cli_parameters.js";
import { validate_config } from "./utils/config_validation.js";

const root_dir = process.cwd();
const parsed_parameters = parse_parameters(process.argv);

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
 * The function responsible for transforming raw files into their final form.
 * @async
 * @param {object[]} files - The files to be processed and transferred into the final distribution directory
 * @param {object} config - The configuration object loaded via the `loade_config` function.
 * @returns {void} 
 */
async function process_files (files, config) {
  const { dist_dir, links } = config;
  
  for (const { name, parentPath: parent_path } of files) {
    const file_path = path.relative(root_dir, path.join(parent_path, name));
    const final_file_dir = path.join(dist_dir, path.dirname(file_path));

    let contents = await fs.promises.readFile(file_path, { encoding: "utf-8" }).catch((error) => {
      console.error(`Error reading file ${file_path}:`, error.message);
		  process.exit(1);
    });

    for (const key of Object.keys(links)) {
      const regex = new RegExp(`(?<="|'|\`|./|/|../)\\${key}(?="|'|\`|/)`, "g");
      contents = contents.replace(regex, links[key]);
    }

    await fs.promises.mkdir(final_file_dir, { recursive: true }).catch((error) => {
      console.error(`Error creating directory for ${file_path}:`, error.message);
		  process.exit(1);
    });

    await fs.promises.writeFile(path.join(dist_dir, file_path), contents, { encoding: "utf-8" }).then((result) => {
      console.info(`Processed ${file_path}`);
    }).catch((error) => {
      console.error(`Error writing file ${file_path})}:`, error.message);
			process.exit(1);
    });
  }
}

/**
 * Filters the given directories based on the config.
 * @deprecated This function is deprecated and will be removed in future versions (maybe, not totally sure).
 * @param {object[]} directories - The directories to filter.
 * @param {object} config - The configuration object loaded via the `load_config` function.
 * @returns {object[]} - The filtered directories.
 */
function filter_directories (directories, config) {
  const { exclude, dist_dir } = config;
  return directories.filter((dir) => dir.name !== dist_dir
  && !exclude.includes(dir.name)
  && dir.isDirectory());
}

/**
 * Reads the given directory and returns its contents.
 * @async
 * @param {string} directory - The directory to read.
 * @returns {Promise<object[]>} - The contents of the directory as an array of file objects.
 */
async function read_directory (directory) {
  const contents = await fs.promises.readdir(directory, { withFileTypes: true }).catch((error) => {
    console.error(`Error reading directory ${directory}:`, error.message);
    process.exit(1);
  });

  return contents;
}

/**
 * Recursively processes directories and their contents, applying transformations and writing the results to the distribution directory.
 * @async
 * @param {string} initial_directory - The initial directory to use as a starting point.
 * @param {object} config - The configuration object containing settings for the processing.
 * @returns {void}
 */
async function directories_waterfall (initial_directory, config) {
  const contents = await read_directory(initial_directory);
  process_files(contents, config);
  const directories = filter_directories(contents, config);

  while (directories.length) {
    const dir = directories.pop();
    const dir_path = path.join(dir.parentPath, dir.name);
    const dir_contents = await read_directory(dir_path);

    process_files(dir_contents, config);
    directories.push(...filter_directories(dir_contents, config));
  }
}

/**
 * Handles glob patterns and returns the matching files.
 * @async
 * @param {string[]} patterns - The glob patterns to match files against.
 * @param {string[]} excluded - The directories to exclude from the matching process.
 * @returns {Promise<object[]>} - The matching files as an array of file objects.
 */
async function handle_glob_patterns (patterns, excluded) {
  const files = [];
  for (const pattern of patterns) {
      const exclusion_regex = /\*\*$|\/\*$|\/.*\..*$/; // TODO: separate this last matching pattern.

      if (exclusion_regex.test(pattern)) {
          files.push(...[...await glob(pattern, {
              ignore: excluded,
              withFileTypes: true,
          })].filter(f => !f.isDirectory()));
      } else {
          files.push(...[...await glob(pattern + (pattern.endsWith("/") ? "*" : "/*"), {
              ignore: excluded,
              withFileTypes: true,
          })].filter(f => !f.isDirectory()));
      }
  }

  return files;
}

/**
 * Main entry point for the application.
 * @async
 * @returns {void}
 */
async function main () {
  console.info("Magiclinks Running...");

  const config = await load_config([
    parsed_parameters["-c"] ? pathToFileURL(parsed_parameters["-c"]).href : undefined,
    ...CONFIG_LOCATIONS
  ]).catch((error) => {
    console.error("Error loading configuration:", error.message);
    process.exit(1);
  });

  validate_config(config);
  const { src_dirs, exclude } = config;
  const original_dist_dir = config.dist_dir;
  config.dist_dir = path.normalize(parsed_parameters["-o"] || config.dist_dir);

  exclude.push(original_dist_dir + "/**", config.dist_dir + "/**"); // TODO: make it beautiful!.

  if (!src_dirs.length) { console.info("No source directories were provided. exiting..."); process.exit(0); }
  else process_files(await handle_glob_patterns(src_dirs, exclude), config);
}

main();