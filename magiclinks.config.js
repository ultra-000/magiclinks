export default {
    links: { // Define your links mappings here.
      $_gh_tree: "https://github.com/ultra-000/magiclinks/tree",
      $_gh_commit: "https://github.com/ultra-000/magiclinks/commit"
    },
    src_dirs: [ // The directories to be processed (e.g. `src`).
      "src/**/*.js", 
      "./package.json", 
      "./README.md", 
      "./LICENSE.txt", 
      "./CHANGELOG.md"
    ],
    dist_dir: "dist", // Change if needed. This will be excluded from the process by default. NOTE: this is a normal path not a glob pattern.
    exclude: [ // The directories to be excluded from the process (e.g. `node_modules`).
      "**/node_modules/**", 
      "**/.git/**", 
      "**/.gitignore",
      "./magiclinks.config.js",
      "**/.vscode/**", 
      "**/.env", 
    ],
    watch: false, // Watch for file changes and build only that changed file once it changes.
};