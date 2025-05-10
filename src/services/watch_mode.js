import fs from "fs";
import path from "path";
import { watch } from "chokidar";
import { minimatch } from "minimatch";
import process_files from "./process_files.js";
import { FILES_MATCHING_GLOB, DIRECT_CHILDREN_GLOB } from "../constants.js";

/**
 * Watches specified directories for file changes and triggers processing.
 *
 * @param {object} config - The configuration object containing the settings for the operation.
 * @returns {void}
 */
export default function start_watch (config) {
    const { dist_dir, src_dirs, exclude } = config;
    const watcher = watch("./", {
        ignored: (p) => exclude.some((pattern) => minimatch(p, pattern, { dot: true })),
        ignoreInitial: true,
    });

    function processing_helper (p) {
        if (!p) return;
        if (
            !src_dirs.some((pattern) => minimatch(p, pattern)) &&
            !src_dirs.some((pattern) => minimatch(p, path.join(pattern, path.basename(p))))
        ) return;
        
        const dir = path.dirname(p);
        process_files([{ name: path.basename(p), parentPath: dir }], config);
    }

    watcher.on("ready", () => {
        watcher.on("add", processing_helper);
        watcher.on("change", processing_helper);
        watcher.on("unlink", async (p) => {
            if (!p) return;
            const f = path.join(dist_dir, p);

            if (!fs.existsSync(f)) return;
            await fs.promises.unlink(f).catch((error) => {
                console.error(`Error while deleting ${f}:`, error.message);
                process.exit(1);
            });

            console.info(`Deleted: ${f}`);
        });

        watcher.on("addDir", async (p) => {
            for (const pattern of src_dirs) {
                if (FILES_MATCHING_GLOB.test(pattern) || DIRECT_CHILDREN_GLOB.test(pattern)) {
                    const dirs_pattern = path.dirname(pattern); // formats something like: `src/**/*.js` or `src/*` into `src/**` and `src` respectively.
                    
                    if (minimatch(p, dirs_pattern)) {
                        try {
                            await fs.promises.mkdir(path.join(dist_dir, p), { recursive: true });
                            console.info(`Created: ${p}`);
                            return;
                        } catch (err) {
                            console.error(`Error while creating ${p}: `, err.message);
                            process.exit(1);
                        }
                    }
                } else {
                    let end = pattern.length;
                    for (let i = pattern.length - 1; i >= 0; i--) { // Foramt first. `minimatch` seems to hate triling slashes or something.
                        const c = pattern[i];
    
                        if (c === "/") end = i;
                        else break;
                    }
    
                    if (minimatch(p, pattern.substring(0, end))) {
                        try {
                            await fs.promises.mkdir(path.join(dist_dir, p), { recursive: true });
                            console.info(`Created: ${p}`);
                            return;
                        } catch (err) {
                            console.error(`Error while creating ${p}: `, err.message);
                            process.exit(1);
                        }
                    }
                }   
            }
        });
        watcher.on("unlinkDir", async (p) => {
            if (!p) return;
            const dir = path.join(dist_dir, p);

            if (!fs.existsSync(dir)) return;
            await fs.promises.rm(dir, { recursive: true, maxRetries: 3, retryDelay: 1000 }).catch((error) => {
                console.error(`Error while deleting ${dir}:`, error.message);
                process.exit(1);
            });

            console.info(`Deleted: ${dir}`);
        });

        watcher.on("error", (error) => {
            console.error(`Error while watching:`, error.message);
            process.exit(1);
        });
    });
}