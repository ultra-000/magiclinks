#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { CONFIG_LOCATIONS } from "./constants.js";
import parse_parameters from "./utils/parse_cli_parameters.js";

const root_dir = process.cwd();
const parsed_parameters = parse_parameters(process.argv);

/**
 * Loads the configuration file from multiple possible locations in order of priority.
 * Searches through CLI arguments, project root, and user home directory.
 * 
 * @async
 * @param {string[]} config_locations The configuration locations, first valid location will be used
 * @returns {Promise<object>} The loaded configuration object
 * @throws {Error} When no valid configuration file could be found at any location
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
 * **NOTE**: the function modifies the `files` parameter.
 * @param {object[]} files the files to be processed and transferred into the final distribution directory
 * @param {object} config the configuration object loaded via the `loade_config` function.
 * @returns {void} 
 */
async function process_files (files, config) {
  const { dist_dir, types, excluded_types, links } = config;
  files = files.filter((file) => {
    let ext = "";
    for (let index = file.name.length - 1; index >= 0; index--) {
      if (file.name[index] === ".") {
        ext = file.name.slice(index + 1);
        break;
      }
    }

    if (!types.length) return file.isFile() && !excluded_types.includes(ext);
    else return file.isFile() && types.includes(ext) && !excluded_types.includes(ext);
    
  });

  for (const { name, parentPath: parent_path } of files) {
    const file_path = path.join(parent_path, name);
    const final_file_dir = path.join(dist_dir, parent_path);

    let contents = await fs.promises.readFile(file_path, { encoding: "utf-8" }).catch((error) => {
      console.error(`Error reading file ${file_path}:`, error.message);
		  process.exit(1);
    });

    for (const key of Object.keys(links)) {
      contents = contents.replaceAll(key, links[key]);
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
 * @param {object[]} directories The directories to filter.
 * @param {object} config The configuration object loaded via the `load_config` function.
 * @returns {object[]} The filtered directories.
 */
function filter_directories (directories, config) {
  const { exclude } = config;
  const dist_dir = path.normalize(config.dist_dir); // <= to get rid of something like `./` which could be typed by the user in the config file.
  return directories.filter((dir) => dir.name !== dist_dir
  && !(exclude.includes(dir.name) || exclude.includes("./" + dir.name))
  && dir.isDirectory());
}

/**
 * Reads the given directory and returns its contents.
 * @param {string} directory The directory to read.
 * @returns {Promise<object[]>} The contents of the directory as an array of file objects.
 */
async function read_directory (directory) {
  const contents = await fs.promises.readdir(directory, { withFileTypes: true }).catch((error) => {
    console.error(`Error reading directory ${directory}:`, error.message);
    process.exit(1);
  });

  return contents;
}

/**
 * Main entry point for the application.
 * @returns {void} 
 */
async function main () {
  console.info("Magiclinks Running...");

  const config = await load_config([parsed_parameters["-c"] ? pathToFileURL(parsed_parameters["-c"]).href : undefined, ...CONFIG_LOCATIONS]).catch((error) => {
    console.error("Error loading configuration:", error.message);
    process.exit(1);
  });

  const { src_dirs, exclude, links, types, excluded_types } = config;
  const dist_dir = parsed_parameters["-o"] || config.dist_dir || "dist";

  // Make sure no one will have a hard time if they accidentally configured something incorrectly.
  if (Array.isArray(links) || typeof links !== "object") {
    console.error("Invalid configuration: `links` must be an object.");
    process.exit(1);
  } else if (!Array.isArray(src_dirs)) {
    console.error("Invalid configuration: `src_dirs` must be an array.");
    process.exit(1);
  } else if (typeof dist_dir !== "string") {
    console.error("Invalid configuration: `dist_dir` must be a string.");
    process.exit(1);
  } else if (!Array.isArray(exclude)) {
    console.error("Invalid configuration: `exclude` must be an array.");
    process.exit(1);
  } else if (!Array.isArray(types)) {
    console.error("Invalid configuration: `types` must be an array.");
    process.exit(1);
  } else if (!Array.isArray(excluded_types)) {
    console.error("Invalid configuration: `excluded_types` must be an array.");
    process.exit(1);
  }

  if (!src_dirs.length) {
    const contents = await read_directory(".");
    process_files(contents, config);
    const directories = filter_directories(contents, config);
      
    while (directories.length) {
      const dir = directories.pop();
      const dirContents = await read_directory(path.join(dir.parentPath, dir.name));
      process_files(dirContents, config);
      directories.push(...filter_directories(dirContents, config));
    }
  } else {
    for (const src_dir of src_dirs) {
      const contents = await read_directory(src_dir);
      process_files(contents, config);
      const directories = filter_directories(contents, config);

      while (directories.length) {
        const dir = directories.pop();
        const dirContents = await read_directory(path.join(dir.parentPath, dir.name));
        process_files(dirContents, config);
        directories.push(...filter_directories(dirContents, config));
      }
    }
  }
}

main();