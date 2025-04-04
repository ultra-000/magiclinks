import path from "path";

export const CONFIG_LOCATIONS = [
    // Project root configuration file, mid priority.
    path.join(process.cwd(), "magiclinks.config.js"),
    // User's home directory, lowest priority.
    path.join(process.env.HOME, ".magiclinks.config.js"),
];

export const CLI_PARAMETERS_SPEC = {
    "-c": {
        expects_value: true, // Means: do this CLI parameter needs a value to be specified (e.g. ```-c ./magiclinks.config.js```)
                             // unlike something like `-w` or `--watch` where the presence of the parameter is enough.
        verbose: "--config",
        description: "specify the configuration file path"
    },
    "-o": {
        expects_value: true,
        verbose: "--output",
        description: "specify the output directory"
    }
}