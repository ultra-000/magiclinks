import path from "path";
import { pathToFileURL } from "url";
import parse_parameters from "./utils/parse_cli_parameters.js";

export const ROOT_DIR = process.cwd();
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
    }
}

export const PARSED_PARAMETERS = parse_parameters(process.argv);