import fs from "fs";
import process_files from "./process_files.js";

export default function watch (directories, config) {
    for (const dir of directories) {
        const watcher = fs.watch(dir);
    
        let counter = 0; // To avoid weird Node.js debounce bug.
        watcher.on("change", async (e, f) => {
            if (!f) return;
            if (counter >= 1) { counter = 0; return; }
            else counter++;

            process_files([{ name: f, parentPath: dir }], config);
        });
    
        watcher.on("error", (error) => {
            console.error(`Watcher error for directory ${dir}:`, error.message);
            process.exit(1);
        });
    
        watcher.on("close", () => {
            console.log(`Watcher closed for directory: ${dir}`);
        });      
    }
}