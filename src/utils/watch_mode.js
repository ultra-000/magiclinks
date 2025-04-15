import fs from "fs";
import path from "path";
import { watch } from "chokidar";
import process_files from "./process_files.js";

/**
 * Watches specified directories for file changes and triggers processing.
 *
 * @param {object} directories - The directories to watch, passed as an object with the directory paths as keys.
 * @param {object} config - The configuration object containing the settings for the operation.
 * @returns {void}
 */
export default function start_watch (directories, config) {
    const { dist_dir } = config;
    const watcher = watch(Object.keys(directories), {
        ignoreInitial: true,
        depth: 0,
    });

    function processing_helper (p) {
        if (!p) return;

        const dir = path.dirname(p);
        if  (directories[dir].extensions.length && !directories[dir].extensions.includes(path.extname(p).substring(1))) return;
        process_files([{ name: path.basename(p), parentPath: dir }], config);
    }

    watcher.on("ready", () => {
        watcher.on("add", processing_helper);
        watcher.on("change", processing_helper);
        watcher.on("unlink", async (p) => {
            if (!p) return;
            const f = path.join(dist_dir, p);
            await fs.promises.unlink(f).catch((error) => {
                console.error(`Error while deleting ${f}:`, error.message);
                process.exit(1);
            });

            console.info(`Deleted ${f}`);
        });

        watcher.on("error", (error) => {
            console.error(`Error while watching:`, error.message);
            process.exit(1);
        });
    });
}