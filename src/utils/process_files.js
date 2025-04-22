import fs from "fs";
import path from "path";
import { PROCESS_CWD } from "../constants.js";

/**
 * Resolves nested magic links to their final values
 * @param {string} value - The value to resolve
 * @param {object} links - Map of all magic links
 * @param {Set<string>} seen - Track links to detect cycles
 * @returns {string} The fully resolved value
 */
function resolve_link_value(value, links, seen = new Set()) {
  if (!value.includes("$_")) return value;
  
  const path_segments = value.split("/");
  const magic_link_regex = /^\$_[^\s]+/g;
  
  return path_segments.map(segment => {
    if (!/^\$_/.test(segment)) return segment;
    
    return segment.replace(magic_link_regex, (match) => {
      if (seen.has(match)) {
        console.error(`Circular reference detected in links: ${match}`);
        process.exit(1);
      }
      
      if (!links[match]) return match;
      seen.add(match);
      const resolved = resolve_link_value(links[match], links, seen);
      seen.delete(match);
      return resolved;
    });
  }).join("/");
}

/**
 * The function responsible for transforming raw files into their final form.
 * @async
 * @param {object[]} files - The files to be processed and transferred into the final distribution directory
 * @param {object} config - The configuration object containing the settings for the process
 * @returns {void} 
 */
export default async function process_files(files, config) {
  const { dist_dir, links } = config;

  // Pre-resolve all nested links once
  const resolved_links = {};
  for (const [key, value] of Object.entries(links)) {
    resolved_links[key] = resolve_link_value(value, links);
  }
  
  await Promise.all(files.map(async ({ name, parentPath: parent_path }) => {
    const file_path = path.relative(PROCESS_CWD, path.join(parent_path, name));
    const final_file_dir = path.join(dist_dir, path.dirname(file_path));

    let contents = await fs.promises.readFile(file_path, { encoding: "utf-8" });

    // Use pre-resolved links for replacements
    for (const [key, value] of Object.entries(resolved_links)) {
      const regex = new RegExp(`\\${key}\\b`, "g");
      contents = contents.replace(regex, value);
    }

    await fs.promises.mkdir(final_file_dir, { recursive: true });
    await fs.promises.writeFile(path.join(dist_dir, file_path), contents);
    console.info(`Processed ${file_path}`);
  }));
}