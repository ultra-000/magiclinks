import fs from "fs";
import path from "path";
import { ROOT_DIR } from "../constants.js";

/**
 * The function responsible for transforming raw files into their final form.
 * @async
 * @param {object[]} files - The files to be processed and transferred into the final distribution directory
 * @param {object} config - The configuration object containing the settings for the process
 * @returns {void} 
 */
export default async function process_files(files, config) {
  const { dist_dir, links } = config;
  
  // Process all files concurrently and wait for all to complete
  await Promise.all(files.map(async ({ name, parentPath: parent_path }) => {
    const file_path = path.relative(ROOT_DIR, path.join(parent_path, name));
    const final_file_dir = path.join(dist_dir, path.dirname(file_path));

    let contents = await fs.promises.readFile(file_path, { encoding: "utf-8" });

    for (const key of Object.keys(links)) {
      const regex = new RegExp(`(?<="|'|\`|./|/|../)\\${key}(?="|'|\`|/)`, "g");
      contents = contents.replace(regex, links[key]);
    }

    await fs.promises.mkdir(final_file_dir, { recursive: true });
    await fs.promises.writeFile(path.join(dist_dir, file_path), contents, { encoding: "utf-8" });
    console.info(`Processed ${file_path}`);
  }));
}