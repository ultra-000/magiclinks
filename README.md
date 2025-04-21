# Magiclinks

<br/>

[![npm version](https://img.shields.io/npm/v/magiclinks.svg)](https://www.npmjs.com/package/magiclinks)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contribution-)
[![Changelog](https://img.shields.io/badge/changelog-browse-brightgreen)](CHANGELOG.md)


## Brief and important information 📝

Use Magiclinks to replace static links in your project with dynamic ones.
this is especially useful when the resources' locations used in you project (e.g. an image) are **subject to change**.

the concept is similar if not identical to the concept of [magic numbers](https://en.wikipedia.org/wiki/Magic_number_(programming)) or read [this stackoverflow post](https://stackoverflow.com/questions/47882/what-are-magic-numbers-and-why-do-some-consider-them-bad) if you don't prefer wikipedia's style.

if you were afraid of changing some resource's location and breaking every file in your project that is depending on that resource then this library will be very helpful for you.

**💡 Note:** The library is still on its eraly stages so a lot of changes, refinements and features will be made so bare with me until it gets to a stable version. If you want to have a look at these changes you can check the [CHANGELOG.md](CHANGELOG.md). And if you encountered any problems please feel free to [open an issue](https://github.com/ultra-000/magiclinks/issues).

<br/>

## Installation: 

```sh
npm install --save-dev magiclinks
```

<br/>

## Usage: 
```sh
npx magiclinks
```
**Warning: This command is deprecated and will just print help in the future, see the [CLI Options section](#cli-command-line-options-) for the new build command.**

<br/>

### The configuration file

The configuration file contains the links mappings and other options that Magiclinks will use to operate.

Since `magiclinks.config.js` is a standard JavaScript file, you can:

- Use variables and constants
- Import other modules 
- Write helper functions
- Use template literals
- Access environment variables
- Any other JavaScript functionality

<br/>

**the configuration file should be placed at the project root and be named `magiclinks.config.js` (or if it is global and meant to be placed in your OS-specific home directory it should be `.magiclinks.config.js`) if your not using `-c` or `--config` option to specify a custom location ⚠️**

**Here is a sample configuration file:**
```js
// magiclinks.config.js
import base_config from "./base_config.js"; // Do something with `base_config`

const base = "https://example.com"; // base URL for links.
const assets = `${base}/assets`; // base URL for assets.

export default {
    links: { // Define your links mappings here.
        $_base: base,
        $_assets: assets,
        $_home: `${base}/index.html`,
        $_404: `${base}/404.html`, // :|
        $_about: `${base}/about.html`,
        $_products: `${base}/products/listing`,
        $_placeholder_profile_pic: `${assets}/images/profile.png`,
        $_100x100_placeholder: `https://placeholde.co/100x100`,
    },
    src_dirs: ["**/src/**", "**/public/**"], // The directories to be processed (e.g. `src`).
    dist_dir: "dist", // Change if needed. This will be excluded from the process by default. NOTE: this is a normal path not a glob pattern.
    exclude: ["**/node_modules/**", "**/.git/**", "**/.env", "**/.gitignore", "**/build/**"], // The directories to be excluded from the process (e.g. `node_modules`).
    watch: true, // Watch for file changes and build only that changed file once it changes.
};
```

<br/>

### That is it for the brief introduction 🏁
you can read more if you want to but this is probably will get you started.

<br/>

## CLI (Command-line) Options 👩‍💻

### `-b` or `--build` option

This is the primary command to process your project files using Magiclinks. When you run this command, Magiclinks will:

1.  Read the configuration from your `magiclinks.config.js` file (or the file specified with `-c`).
2.  Scan the files and directories specified in the `src_dirs` patterns.
3.  For each file found (that isn't excluded by the `exclude` patterns or the `dist_dir`), it will replace all occurrences of the placeholder keys defined in your `links` object with their corresponding values.
4.  Write the processed files to the specified `dist_dir`, preserving the original directory structure.

This performs a one-time build operation. If you need Magiclinks to automatically rebuild when files change, use it with the `-w` or `--watch` option or the `watch` key with a value of `true` in your configuration file instead.

**Example:**

```sh
npx magiclinks -b
# or
npx magiclinks --build
```
**IMPORTANT: you should run this command at your project's root ⚠️**

<br/>

### `-i` or `--init` option

Quickly sets up Magiclinks by creating a default `magiclinks.config.js` (or `.magiclinks.config.js` if you are in your OS-specific home directory) file in your current working directory.

If a configuration file already exists, you'll be prompted to overwrite it.

But because the configuration file is just a JavaScript file like any other, I expected people to use it as such, so overwriting won't really overwrite your whole file but just the `export default {}` block (if any). Preserving any code, functions or any other logic you might have.

**Example:**

```sh
npx magiclinks -i
# or
npx magiclinks --init
```

**💡 Note:** I should note that if your already-existing `magiclinks.config.js` or `.magiclinks.config.js` doesn't have a mount point (i.e. the `export default {}` statement) Magiclinks will tell you to make one and then it will exit, I won't provide it for you, you place it where you like!

<br/>

### `-w` or `--watch` option

Watch for file changes and build only that changed file once it changes.

**Example:**

```sh
npx magiclinks -w
```
this option is also available in the configuration file as well.

<br/>

### `-c` or `--config` option

Specify a custom on-the-fly configuration file.

**Example:**

```sh
npx magiclinks -c <path-to-config-file>
# or
npx magiclinks --config <path-to-config-file>
```

<br/>

### `-o` or `--output` option

Specify a custom on-the-fly output directory.

**Example:**

```sh
npx magiclinks -o <path-to-output-directory>
# or
npx magiclinks --output <path-to-output-directory>
```

<br/>

## Configuration Options ⚙️

### The `links` field 🔗

The `links` field is where you define your links mappings. for example you if got this in your `magiclinks.config.js`:
```js
// magiclinks.config.js
links: {
    $_apple_touch_icon: "assets/images/apple-touch-icon.png",
}
```

and then in your project files:
```html
<!-- index.html -->
<link rel="apple-touch-icon" href="$_apple_touch_icon"> <!-- After the build process this will be replaced with the real link -->
```
```html
<!-- about/index.html -->
<link rel="apple-touch-icon" href="$_apple_touch_icon"> <!-- After the build process this will be replaced with the real link -->
```

then if you were to change that resource location say to something like `resources/images/apple-touch-icon.png` you only need to change the URL in one place which is in your `links` field and **not in each and every file that ever used or still using that resource**.

or if you are a React guy/girl you will typically have a setup like the following:

```js
// magiclinks.config.js
export default {
  links: {
    $_api_endpoint: "https://api.myapp.com/v1",
    $_auth_endpoint: "https://auth.myapp.com",
    $_assets_cdn: "https://cdn.myapp.com/assets",
    $_avatar_placeholder: "/images/default-avatar.png",
    $_logo_dark: "/branding/logo-dark.svg",
    $_logo_light: "/branding/logo-light.svg"
  },
  src_dirs: [
    "**/src/components/**/*.{js,ts}",
    "src/pages/**",
    "src/layouts/**",
    "public/*.html"
  ],
  dist_dir: "dist",
  exclude: ["**/node_modules/**", "**/.git/**", "**/build/**", "**/coverage/**"],
  watch: false,
}
```

Then in your React components:

```jsx
// src/components/Header.jsx
function Header() {
  return (
    <header>
      <img 
        src="$_logo_dark"
        alt="Logo"
        className="dark:hidden"
      />
      <img 
        src="$_logo_light"
        alt="Logo"
        className="hidden dark:block"
      />
    </header>
  )
}

// src/features/auth/api.js
const API_URL = "$_api_endpoint";
const AUTH_URL = "$_auth_endpoint";

export async function login(credentials) {
  const response = await fetch(`${AUTH_URL}/login`, {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
  return response.json();
}
```

After building using the `npx magiclinks` command, all `$_` prefixed strings will be replaced with their actual values, making it easy to change endpoints or asset locations in one place.

**💡 Note:** While Magiclinks works great with any file type, **it's particularly powerful in languages that don't have native variables support** like HTML, XML, or something similar. but in JavaScript or even CSS you got native variables that could be used to achieve similar results.

<br/>

### The `src_dirs` field 📂

The `src_dirs` field is used to specify the directories to include in the build process, if you didn't specify any directories **the library will exit without doing anything**.

Now the glob patterns used in `src_dirs` or `exclude` are the same but needs a little explanation, unlike for example TypeScript take on glob patterns handling I have took a slightly different route.

Here's how glob patterns work in Magiclinks:

#### 1. Direct Files Only
```js
src_dirs: ["src"]     // Only matches files directly in src/
src_dirs: ["src/*"]   // Same behavior as above
```

Unlike TypeScript where `"src"` includes everything recursively, Magiclinks requires you to be explicit about depth.

#### 2. Deep Include
```js
src_dirs: ["src/**"]  // Matches all files in src/ at any depth, just like regular agreed upon glob patterns, so nothing special.
```

#### 3. Standard Glob Patterns
Magiclinks uses the [glob](https://www.npmjs.com/package/glob?activeTab=readme) npm package for pattern matching support if you want to check any specific thing.

Some examples for standard patterns:

```js
src_dirs: [
  "**/src/**",           // All files in any src directory at any depth
  "**/src/*.{js,ts}",    // Only JS/TS files directly in any src directory
  "public/*.html",       // HTML files directly in public/
]
```

**💡 Note:** Be explicit about what you want to include - Magiclinks favors clarity over convenience.

<br/>

### The `dist_dir` field ↪️

The `dist_dir` field is used to specify the output directory.

**💡 Note: Your project structure will be preserved**.

<br/>

### The `exclude` field ⛔️

The `exclude` field is used to specify the directories to be excluded from the build process.

**💡 Note: You don't need to exclude the `dist_dir` (i.e. the output directory) manually as it is excluded by default.**

<br/>

## Contribution 🌏️

**Any contribution is welcome!** really anything will be helpful, especially contributions made to this broken documentation, there is a lot of features that you could implement and a some bugs that you could fix, **so please feel free to contribute :)**.

**💡 Note:** If you could code using **snake_case** instead of **camelCase** it would be really great thanks!,
if I found that people (if any) prefer **camelCase** then will switch to that instead.

<br/>

## Thanks to free resources out there! 🙏

I am a self-taught dev totally learning from free resources, if not for them I wouldn't be to build these things (especially Mozilla developer network and W3Schools), so this is my little gift to the community, hopefully it will be of some benefit :).