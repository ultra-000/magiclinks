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
if you want you could specify an on-the-fly configuration file or output directory using:
```sh
npx magiclinks -c <path-to-config-file> -o <path-to-output-directory>
```
or 
```sh
npx magiclinks --config <path-to-config-file> --output <path-to-output-directory>
```

**IMPORTANT: you should run these commands at your project's root ⚠️**

<br/>

### The configuration file

The configuration file contains the links mappings and other options that Magiclinks will use to operate.

**it should be placed at the project root and be named `magiclinks.config.js` if your not using `-c` or `--config` option to specify a custom location ⚠️**

**Here is a sample configuration file:**
```js
// magiclinks.config.js

export default {
  links: { // Define your links mappings here.
    $_github: "https://github.com"
    $_some_resource_with_a_variable_location: "assets/images/apple-touch-icon.png"
  },
  src_dirs: ["**/src/**", "**/views/**/*.html", "scripts/*.{js,ts}"], // The directories to be processed (e.g. `src`).
  dist_dir: "./dist", // Change if needed. This will be excluded from the process by default. NOTE: this is a normal path not a glob pattern.
  exclude: ["**/node_modules/**", "**/.git/**", "**/.env", "**/.gitignore", "**/build/**"], // The directories to be excluded from the process (e.g. `node_modules`).
};
```

<br/>

### That is it for the brief introduction 🏁
you can read more if you want to but this is probably will get you started.

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

**💡 Note:** Your not restricted to the `$_` prefix you could really have anything as the key, it just a convention I made to avoid interactions with strings that aren't meant to be related to Magiclinks, but I recommend sticking to it as who knows maybe it will be used in a special way in the future.

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

<br/>

### Another thing... 👇️

Here is a ready-to-use config file, you could consider it as the "default" config file:
```js
export default {
  links: {}, // Define your links mappings here.
  src_dirs: ["**/src/**", "**/public/**"], // The directories to be processed (e.g. `src`).
  dist_dir: "./dist", // Change if needed. This will be excluded from the process by default. NOTE: this is a normal path not a glob pattern.
  exclude: ["**/node_modules/**", "**/.git/**", "**/.env", "**/.gitignore", "**/build/**"], // The directories to be excluded from the process (e.g. `node_modules`).
};
```
this ready-to-go file is mostly for absolute juniors out there, as I have been one before and it was really hard navigating my way through huge projects (I am not saying that this is a huge project by any means) and finding the most basic of things, don't underestimate it even such a small thing will help the developers of less experience that are often overlooked.