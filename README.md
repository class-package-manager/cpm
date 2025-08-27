
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

### 2. Publish a package to CPM (staging)

```bash
cpm publish ./packages/hello
```

* Submits a package for review to **CPM central repository**.
* Your package must have a `package.json` with:

  * `name` (e.g., `@username/hello`)
  * `version`
  * `"type": "module"`
* After maintainers approve it, it will be **automatically published to npm** and available for installation.

> Only CPM maintainers can approve and publish packages to the central repository.

---

### CPM Workflow Diagram

```
          ┌───────────────────┐
          │  Developer creates │
          │  a package locally │
          └────────┬──────────┘
                   │
                   ▼
          ┌───────────────────┐
          │  cpm publish      │
          │  (stages package) │
          └────────┬──────────┘
                   │
                   ▼
          ┌───────────────────┐
          │  Maintainer review │
          │  cpm review       │
          └────────┬──────────┘
                   │
           Approve │ Reject
                   │
       ┌───────────┴────────────┐
       │                        │
       ▼                        ▼
┌───────────────┐        ┌───────────────┐
│ Package auto  │        │ Package stays │
│ published to  │        │ in staging    │
│ npm (global)  │        │ for updates   │
└───────┬───────┘        └───────────────┘
        │
        ▼
┌───────────────────┐
│  Users can now    │
│  install package  │
│  via cpm install  │
└───────────────────┘
```

---

### 3. Review and approve staged packages (for maintainers)

```bash
cpm review
```

* Shows all staged packages in `~/.cpm_submissions`.
* Maintainers can select packages to publish to npm.
* Once published, the package is removed from the staging folder.

---

### 4. Install a package from npm

```bash
cpm install @username/hello
```

* Downloads the package into your project’s `.cpm` folder.
* Updates `.cpm/cpm.json` to track the package.

```ts
// Example usage
import hello from './.cpm/@username_hello/index.ts';
hello();
```

---

### 5. Search for packages

```bash
cpm search hello
```

* Searches **npm** for packages matching the keyword `hello`.
* Returns results in the terminal.

---

### 6. List installed packages

```bash
cpm list
```

* Shows all installed CPM packages and versions in the current project.

---

### 7. Uninstall a package

```bash
cpm uninstall @username/hello
```

* Removes a package from your project.
* Updates `.cpm/cpm.json`.

---

## Folder Structure Example

```
my-project/
├─ .cpm/
│  └─ @username_hello/
├─ packages/
│  └─ hello/
│     ├─ index.ts
│     └─ package.json
├─ src/
│  └─ index.ts
└─ package.json
```

---

## First Package Tutorial

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
  "name": "@username/greet",
  "version": "1.0.0",
  "type": "module",
  "main": "index.ts"
}
```

---

2. **Publish your package to CPM**

```bash
cpm publish ./packages/greet
```

> Your package is now staged for review. After a maintainer approves it, it will be published to npm.

---

3. **Install it in your project**

```bash
cpm install @username/greet
```

---

4. **Use it in your code**

```ts
import greet from './.cpm/@username_greet/index.ts';

greet('World'); // prints: Hello, World!
```

---

## Tips & Best Practices

* **Versioning:** Increment `version` in `package.json` for every update. Follow semantic versioning: `MAJOR.MINOR.PATCH`.
* **Unique Names:** Use your npm username in the package name (`@username/package`) to avoid conflicts.
* **Keep it Simple:** Each package should export a single class/function or a small related set.
* **Documentation:** Include comments and usage examples inside the code.
* **Testing:** Test your package locally with `cpm install` before publishing.
* **Dependencies:** Keep external dependencies minimal to avoid bloating your packages.
* **Review Workflow:** Only submit packages to CPM. Maintainers handle publishing to npm.

---

## License

MIT
