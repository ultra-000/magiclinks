#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { CONFIG_LOCATIONS } from "./constants.js";
import parse_parameters from "./utils/parse_cli_parameters.js";

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
      const config = await import(path.join(process.cwd(), config_path));
      return config.default;
    } catch (error) {
      continue; // Try next location.
    }
  }
  throw new Error("No valid configuration file found.");
}

/**
 * The function responsible for transforming raw files into their final form
 * @param {object[]} files the files to be processed and transferred into the final distribution directory
 * @param {object} links the links to be used in the replacement process
 * @param {string} dist_dir the output directory
 * @returns {void} 
 */
function process_files (files, links, dist_dir) {
  files.filter((file) => file.name.endsWith(".html") && file.isFile()).forEach(({ name, parentPath: file_path }) => {
    fs.readFile(path.join(file_path, name), { encoding: "utf-8" }, (error, contents) => {
      if (error) {
        console.error(`Error reading file ${file_path}/${name}:`, error.message);
		    process.exit(1);
      }

      for (const key of Object.keys(links)) {
        contents = contents.replaceAll(key, links[key]);
      }

      fs.mkdir(path.join(dist_dir, file_path), { recursive: true }, (error) => {
        if (error) {
          console.error(`Error creating directory for ${file_path}/${name}:`, error.message);
		      process.exit(1);
        }

        fs.writeFile(path.join(dist_dir, file_path, name), contents, (error) => {
          if (error) {
            console.error(`Error writing file ${file_path}/${name})}:`, error.message);
			      process.exit(1);
          } else {
            console.info(`Processed ${file_path}/${name}`);
          }
        });
      });
    });
  });
}


/**
 * Main entry point for the application.
 * @returns {void} 
 */
async function main () {
  console.info("Magiclinks Running...");
  const root_dir = process.cwd();
  const parsed_parameters = parse_parameters(process.argv);

  const config = await load_config([parsed_parameters["-c"], ...CONFIG_LOCATIONS]).catch((error) => {
    console.error("Error loading configuration:", error.message);
    process.exit(1);
  });

  const { src_dirs, exclude, links } = config;
  const dist_dir = parsed_parameters["-o"] || config.dist_dir || "dist"; // This line is kinda verbose and annoying, but it works so...

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
  }

  if (!src_dirs.length) {
    fs.readdir(root_dir, { encoding: "utf8", withFileTypes: true }, (error, src_dirs) => {
      if (error) {
        console.error(`Error reading directory ${root_dir}:`, error.message);
        process.exit(1);
      }

      src_dirs = 
        src_dirs.filter((dir) => path.join(dir.parentPath, dir.name) !== path.join(dir.parentPath, dist_dir)
        && !exclude.includes(dir.name)
        && dir.isDirectory());
      
        // If no source directories were found, exit with the program.
      if (!src_dirs.length) {
        console.error("No source directories found. exiting program...");
        process.exit(1);
      }

      src_dirs.forEach(({ name }) => {
        fs.readdir(name, { encoding: "utf8", recursive: true, withFileTypes: true }, (error, files) => {
          if (error) {
            console.error(`Error reading directory ${name}:`, error.message);
            process.exit(1);
          }

          process_files(files, links, dist_dir);
        });
      });
    });
  } else {
    src_dirs.forEach((src_dir) => {
      fs.readdir(src_dir, { encoding: "utf8", recursive: true, withFileTypes: true }, (error, files) => {
        if (error) {
          console.error(`Error reading directory ${src_dir}:`, error.message);
          process.exit(1);
        }

        process_files(files, links, dist_dir);
      });
    });
  }
}

main();