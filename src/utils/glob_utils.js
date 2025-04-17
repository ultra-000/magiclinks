import path from "path";
import { glob } from "glob";
import { MATCH_ALL_GLOB, GENERAL_MATCHING_GLOB, FILES_MATCHING_GLOB, DIRS_MATCHING_GLOB, DIRECT_CHILDREN_GLOB } from "../constants.js";

/**
 * Handles glob patterns and returns the matching files.
 * @async
 * @param {string[]} patterns - The glob patterns to match files against.
 * @param {string[]} excluded - The directories to exclude from the matching process.
 * @returns {Promise<object[]>} - The matching files as an array of file objects.
 */
export async function extract_files_from_glob (patterns, excluded) {
    const files = [];
    for (const pattern of patterns) {
        if (FILES_MATCHING_GLOB.test(pattern)) {
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
 * Extracts directories from glob patterns and determines their traversal mode.
 * Used primarily for watch mode to determine which directories need monitoring.
 * 
 * For example:
 * - "src/**" -> { "src": { recursive: true } }
 * - "lib/" -> { "lib": { recursive: false } }
 * 
 * @deprecated It didn't go very well, there is a lot of edge cases. Yet I plan to fix it.
 * @param {string[]} patterns - Glob patterns to extract directories from
 * @param {string[]} exclude - Patterns to exclude from directory matching
 * @returns {Promise<Object.<string, {recursive: boolean}>>} Map of directory paths to their traversal mode
 * 
 * @example
 * const dirs = await extract_dirs_from_files_glob(["lib/*.css"], ["node_modules"]);
 * // Result: "lib": { recursive: false }
 */
export async function extract_dirs_from_glob_deprecated (patterns, exclude) {
    const dirs = {};
    for (const pattern of patterns) {
        const dirs_pattern = path.dirname(pattern)  + "/"; // A pattern to retrieve directories.
        
        if (/^\*\*$/.test(pattern)) {
            dirs["./"] = { recursive: true };
            return dirs;
        }

        if (FILES_MATCHING_GLOB.test(pattern)) {
            const recursive = /\/\*\*$/.test(pattern);
            for (const dir of await glob(dirs_pattern, { ignore: exclude })) {
                dirs[dir] = { recursive };
            }
        } else {
            for (const dir of await glob(pattern, { ignore: exclude })) {
                dirs[dir] = { recursive: false };
            }
        }
    }

    return dirs;
}

export function extract_extensions_from_files_glob (pattern) {
    if (/\/.*\.\*$/.test(pattern)) return []; // Means: include all extensions.
    if (pattern[pattern.length] === "}") {
        let ext_str = "";
        for (let i = pattern.length - 2; i >= 0; i--) {
            const c = pattern[i];
            if (c === "*") return []; // Means: include all extensions.
            if (c === "{") break;
            if (c === " ") continue;
            ext_str = c + ext_str;
        }

        return ext_str.split(",");
    }

    const ext = path.extname(pattern).substring(1);
    return !ext.length ? [] : [ext];
}

/**
 * Extracts directories from glob patterns.
 * Mainly to be used with the watch mode.
 * @async
 * @param {string[]} patterns - The glob patterns to extract directories from
 * @param {string[]} exclude - The glob patterns to exclude dircetories with
 * @returns {object} - The directories as an object with the directory paths as keys
 */
export async function extract_dirs_from_glob (patterns, exclude) {
    const dirs = [];

    for (const pattern of patterns) {
        const dirs_pattern_v1 = pattern + "/"; // A pattern to retrieve directories from globs like: `src/**`.
        const dirs_pattern_v2 = path.dirname(pattern)  + "/"; // A pattern to retrieve directories from files' globs example: `src/**/*.js`.

        if (MATCH_ALL_GLOB.test(pattern)) { // He/she have included the whole project, so no need for futher extracting.
            const fresh_dirs = {};
            for (const dir of await glob(dirs_pattern_v1, { ignore: exclude })) {
                fresh_dirs[dir] = { extensions: [] };
            }

            return fresh_dirs;
        }

        if (FILES_MATCHING_GLOB.test(pattern) || DIRECT_CHILDREN_GLOB.test(pattern)) {
            for (const dir of await glob(DIRECT_CHILDREN_GLOB.test(pattern) && /\/\*\*\/\*$/ ? dirs_pattern_v1 : dirs_pattern_v2, { ignore: exclude })) {
                !dirs[dir] ? dirs[dir] = { extensions: extract_extensions_from_files_glob(pattern) } : dirs[dir].extensions.push(...extract_extensions_from_files_glob(pattern));
            }
        } else if (GENERAL_MATCHING_GLOB.test(pattern) ) {
            for (const dir of await glob(dirs_pattern_v1, { ignore: exclude })) {
                !dirs[dir] ? dirs[dir] = { extensions: [] } : null;
            }
        } else {
            for (const dir of await glob(pattern, { ignore: exclude })) {
                !dirs[dir] ? dirs[dir] = { extensions: [] } : null;
            }
        }
    }

    return dirs;
}