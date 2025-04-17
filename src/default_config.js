export default {
    links: {}, // Define your links mappings here.
    src_dirs: ["**/src/**", "**/public/**"], // The directories to be processed (e.g. `src`).
    dist_dir: "dist", // Change if needed. This will be excluded from the process by default. NOTE: this is a normal path not a glob pattern.
    exclude: ["**/node_modules/**", "**/.git/**", "**/.env", "**/.gitignore", "**/build/**"], // The directories to be excluded from the process (e.g. `node_modules`).
    watch: false, // Watch for file changes and build only that changed file once it changes.
};