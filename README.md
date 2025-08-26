# Class Package Manager (CPM)

> Manage sharable classes/components for your projects, like npm but for individual classes and functions.

---

## Installation

Globally via npm:

```bash
npm install -g class-package-manager
````

Or for local development (link your repo):

```bash
npm link
```

---

## Usage

### 1. Initialize a CPM project

```bash
cpm init
```

* Creates a `.cpm/cpm.json` file in your project.
* Tracks installed CPM packages.

---

### 2. Publish a local package

```bash
cpm publish ./packages/hello
```

* Publishes a local package to your **local registry** (`~/.cpm_registry`).
* Your package must have a `package.json` with `name` and `version`.

---

### 3. Install a package

```bash
cpm install hello
```

* Installs a published package into your project’s `.cpm` folder.
* Updates `.cpm/cpm.json` to track the package.

```ts
// Example usage
import hello from './.cpm/hello@1.0.0/index.ts';
hello();
```

---

### 4. List installed packages

```bash
cpm list
```

* Shows all installed CPM packages and versions.

---

### 5. Uninstall a package

```bash
cpm uninstall hello
```

* Removes a package from your project.
* Updates `.cpm/cpm.json`.

---

## Folder Structure Example

```
my-project/
├─ .cpm/
│  └─ hello@1.0.0/
├─ packages/
│  └─ hello/
│     ├─ index.ts
│     └─ package.json
├─ src/
│  └─ index.ts
└─ package.json
```

---

## Local Registry

* Your local registry is at `~/.cpm_registry`.
* All published packages are stored there for installation in any project.

---

## Development

1. Install dependencies:

```bash
npm install
```

2. Build CLI:

```bash
npm run build
```

3. Test locally:

```bash
npm link
cpm init
cpm publish ./packages/hello
cpm install hello
cpm list
```

---

## First Package Tutorial

Here’s a quick example to get started with CPM:

1. **Create a new package**

```bash
mkdir -p packages/greet
cd packages/greet
npm init -y
```

Create `index.ts`:

```ts
export default function greet(name: string) {
  console.log(`Hello, ${name}!`);
}
```

Make sure `package.json` has:

```json
{
  "name": "greet",
  "version": "1.0.0",
  "type": "module",
  "main": "index.ts"
}
```

---

2. **Publish your package locally**

```bash
cpm publish ./packages/greet
```

---

3. **Install it in your project**

```bash
cpm install greet
```

---

4. **Use it in your code**

```ts
import greet from './.cpm/greet@1.0.0/index.ts';

greet('World'); // prints: Hello, World!
```

---

## Tips & Best Practices

* **Versioning:** Always increment the `version` in `package.json` when updating a package. Use semantic versioning: `MAJOR.MINOR.PATCH`.
* **Unique Names:** Choose a clear, descriptive, and unique package name to avoid conflicts.
* **Keep it Simple:** Each package should ideally export one class/function or a small related set of utilities.
* **Documentation:** Include comments and examples inside your code to make it easy for users to understand usage.
* **Testing:** Test your package locally before publishing with `cpm install` in a separate project.
* **Dependencies:** Minimize external dependencies to keep your packages lightweight.

---

## License

MIT
