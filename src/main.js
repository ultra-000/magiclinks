#!/usr/bin/env node
import fs from "fs";
import path from "path";
import start_watch from "./utils/watch_mode.js";
import { PARSED_PARAMETERS } from "./constants.js";
import process_files from "./utils/process_files.js";
import { load_config_helper } from "./utils/config_loading.js";
import { extract_dirs_from_glob, extract_files_from_glob } from "./utils/glob_utils.js";

const config = await load_config_helper();

/**
 * Reads the given directory and returns its contents.
 * @async
 * @param {string} directory - The directory to read.
 * @param {boolean} withFileTypes - You want data-attached contents?
 * @returns {Promise<object[]>} - The contents of the directory as an array of file objects.
 */
async function read_directory (directory, withFileTypes) {
  const contents = await fs.promises.readdir(directory, { withFileTypes }).catch((error) => {
    console.error(`Error reading directory ${directory}:`, error.message);
    process.exit(1);
  });

  return contents;
}

/**
 * Main entry point for the application.
 * @async
 * @returns {void}
 */
async function main() {
  console.info("Magiclinks Running...");

  const { src_dirs, exclude, watch: watch_mode } = config;
  const original_dist_dir = config.dist_dir;
  config.dist_dir = path.normalize(PARSED_PARAMETERS["-o"] || config.dist_dir);

  exclude.push(original_dist_dir + "/**", config.dist_dir + "/**");

  if (!src_dirs.length) {
    console.info("No source directories were provided. exiting...");
    process.exit(0);
  }

  try {
    // Wait for initial processing to complete
    await process_files(await extract_files_from_glob(src_dirs, exclude), config);
    
    // Start watch mode after processing is done
    if (PARSED_PARAMETERS["-w"] || watch_mode) {
      console.info("Initial processing complete. Starting watch mode...");
      start_watch(await extract_dirs_from_glob(src_dirs, exclude), config);
    }
  } catch (error) {
    console.error("Error during processing:", error.message);
    process.exit(1);
  }
}

main();