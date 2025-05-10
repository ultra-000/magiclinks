import path from "path";
import { glob } from "glob";
import { FILES_MATCHING_GLOB, DIRECT_CHILDREN_GLOB } from "../constants.js";

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
        if (FILES_MATCHING_GLOB.test(pattern) || DIRECT_CHILDREN_GLOB.test(pattern)) {
            files.push(...[...await glob(pattern + (/\*\*\/\*$/.test(pattern) ? "/*" : ""), {
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