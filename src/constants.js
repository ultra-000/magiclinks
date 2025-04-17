import fs from "fs";
import path from "path";
import { pathToFileURL, fileURLToPath } from "url";
import parse_parameters from "./utils/parse_cli_parameters.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const package_root = find_package_root(__dirname);
if (!package_root) {
    console.error("Error: Could not find package.json to determine the package root, make sure it is not deleted. Exisiting...");
    process.exit(1);
}

export const PROCESS_CWD = process.cwd();
export const MATCH_ALL_GLOB = /^\*\*$/;
export const FILES_MATCHING_GLOB = /\/.*\..*$/;
export const DIRS_MATCHING_GLOB = /^(?!.*\.[^/]+$).*$/;
export const DIRECT_CHILDREN_GLOB = /\/\*$/;
export const GENERAL_MATCHING_GLOB = /\/\*\*$|.*\*$|\*.*$/;


export const CONFIG_LOCATIONS = [
    // Project root configuration file, mid priority.
    pathToFileURL("magiclinks.config.js").href,
    // User's home directory, lowest priority.
    pathToFileURL(path.join(process.env.HOME, ".magiclinks.config.js")).href,
];

export const PACKAGE_ROOT = package_root;
export const DEFAULT_CONFIG_PATH = path.join(PACKAGE_ROOT, "src", "default_config.js");
export const CLI_PARAMETERS_SPEC = {
    "-c": {
        expects_value: true, // Means: do this CLI parameter needs a value to be specified (e.g. ```-c ./magiclinks.config.js```)
                             // unlike something like `-w` or `--watch` where the presence of the parameter is enough.
        verbose: "--config",
        description: "specify the configuration file path"
    },
    "-o": {
        expects_value: true,
        verbose: "--output",
        description: "specify the output directory"
    },
    "-w": {
        expects_value: false,
        verbose: "--watch",
        description: "enable watch mode"
    },
    "-i": {
        expects_value: false,
        verbose: "--init",
        description: "initialize a new configuration file at the current directory"
    },
    "-b": {
        expects_value: false,
        verbose: "--build",
        description: "build the project"
    },
}

export const PARSED_PARAMETERS = parse_parameters(process.argv);

function find_package_root (start_dir) {
    let current_dir = start_dir;
    while (true) {
      const package_json_path = path.join(current_dir, "package.json");
      if (fs.existsSync(package_json_path)) {
        return current_dir;
      }
  
      const parent_dir = path.dirname(current_dir);
      if (parent_dir === current_dir) {
        return null;
      }
      current_dir = parent_dir;
    }
}