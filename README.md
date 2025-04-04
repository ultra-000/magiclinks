# Magiclinks

## Brief and important information

Use Magiclinks to replace static links in your project with dynamic ones.
this is especially useful when the resources' locations used in you project (e.g. an image) are **subject to change**.

the concept is similar if not identical to the concept of [magic numbers](https://en.wikipedia.org/wiki/Magic_number_(programming)) or read [this stackoverflow post](https://stackoverflow.com/questions/47882/what-are-magic-numbers-and-why-do-some-consider-them-bad) if you don't prefer wikipedia's style.

if you were afraid of changing some resource's location and breaking every file in your project that is depending on that resource then this library will be very helpful for you.

## Installation:

```sh
npm install --save-dev magiclinks
```

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

### The configuration file

The configuration file contains the links mappings and other options that Magiclinks will use to operate.

**it should be placed at the project root and be named magiclinks.config.js** ⚠️

**Here is a sample configuration file:**
```js
// magiclinks.config.js

export default {
  links: { // Define your links mappings here.
    $_github: "https://github.com",
    $_some_resource_with_a_variable_location: "assets/images/apple-touch-icon.png"
  },
  src_dirs: [], // An empty array means: read all directories in the current directory except for the `dist_dir` directory.
  dist_dir: "dist", // Change if needed.
  exclude: ["node_modules", ".git", "dist"], // The directories to exclude from the process (e.g. `node_modules`).
};
```

### that is it for the brief introduction
you can read more if you want to but this is probably will get you started.

### The `links` field

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

**Note:** your not restricted to the `$_` prefix you could really have anything as the key, it just a convention I made to avoid interactions with strings that aren't meant to be related to Magiclinks, but I recommend stcking to it as who knows maybe it will be used in a special way in the future.

### The `src_dirs` field

The `src_dirs` field is used to specify the directories to include in the build process, if you didn't specify any directories **the whole project will be read except for the directory specified in the `dist_dir` field**.

### The `dist_dir` field

The `dist_dir` field is used to specify the output directory.

**Note: Your project structure will be preserved**.

### The `exclude` field

The `exclude` field is used to specify the directories to be excluded from the build process.

## Contribution

**Any contribution is welcome!** really anything will be helpful, especially contributions made to this broken documentation, there is a lot of features that you could implement and a some bugs that you could fix, **so please feel free to contribute :)**.

**Note:** if you could code using **snake_case** instead of **camelCase** it would be really great, thanks!
if I found that people (if any) prefer **camelCase** then will switch to that instead.

## Thanks to free resources out there!

I am a self-taught dev totally learning from free resources, if not for them I wouldn't be to build these things (especially Mozilla developer network and W3Schools), so this is my little gift to the community, hopefully it will be of some benefit :).

### Another thing...

Here is a ready-to-use config file, you could consider it as the "default" config file:
```js
export default {
  links: {}, // Define your links mappings here.
  src_dirs: [], // An empty array means: read all directories in the current directory except for the `dist_dir` directory.
  dist_dir: "dist", // Change if needed.
  exclude: ["node_modules", ".git", "dist"], // The directories to exclude from the process (e.g. `node_modules`).
};
```
this mostly for absolute juniors out there, as I have been one before and it was really hard navigating my way through huge projects (I am not saying that this is a huge project by any means) and finding the most basic of things, don't underestimate it even such a small thing will help the developers of less experience that are often overlooked.