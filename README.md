
# Class Package Manager (CPM)

> Manage sharable classes and utility functions in your project — like npm, but for individual classes and functions.

---

## 📦 Installation

Install globally:

```bash
npm install -g class-package-manager
````

---

## 🚀 Usage

### Initialize a CPM project

```bash
cpm init
```

* Creates a `.cpm/cpm.json` file in your project.
* Tracks installed CPM packages.

---

### Install a package

```bash
cpm install hello
```

* Downloads the package into your project’s `.cpm` folder.
* Updates `.cpm/cpm.json`.

Example usage:

```ts
import hello from './.cpm/hello/index.ts';
hello();
```

---

### Search for packages

```bash
cpm search hello
```

* Searches **npm** for packages matching `hello`.
* Shows results in the terminal.

---

### List installed packages

```bash
cpm list
```

* Displays all installed CPM packages and their versions.

---

### Uninstall a package

```bash
cpm uninstall hello
```

* Removes the package from `.cpm` and updates `cpm.json`.

---

## 📂 Folder Structure Example

```
my-project/
├─ .cpm/
│  └─ @username_hello/
├─ src/
│  └─ index.ts
└─ package.json
```

---

## ✅ Tips

* Use your npm username for scoped packages: `@username/package`.
* Keep packages small and focused (one class/function or a related set).

---

## 📄 License

MIT
