import path from "path";
import { glob } from "glob";
import { FILES_MATCHING_REGEX, ROOT_DIR } from "../constants.js";

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
        if (FILES_MATCHING_REGEX.test(pattern)) {
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

        if (FILES_MATCHING_REGEX.test(pattern)) {
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

export async function extract_dirs_from_glob (patterns, exclude) {
    const dirs = [];

    for (const pattern of patterns) {
        const dirs_pattern_v1 = pattern + "/"; // A pattern to retrieve directories from globs like: `src/**`.
        const dirs_pattern_v2 = path.dirname(pattern)  + "/"; // A pattern to retrieve directories from files' globs example: `src/**/*.js`.

        if (/^\*\*$/.test(pattern)) { // He/she have included the whole project, so no need for futher extracting.
            return [...await glob(dirs_pattern_v1, {
                ignore: exclude
            })];
        }

        if (/\/\*\*$/.test(pattern)) {
            dirs.push(...await glob(dirs_pattern_v1, {
                ignore: exclude
            }));
        } else if (FILES_MATCHING_REGEX.test(pattern)) {
            dirs.push(...await glob(dirs_pattern_v2, {
                ignore: exclude
            }));
        } else {
            dirs.push(...await glob(pattern, {
                ignore: exclude
            }));
        }
    }

    return dirs;
}