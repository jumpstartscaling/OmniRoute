import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, it } from "node:test";

const root = join(import.meta.dirname, "../..");

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

function pages(dir, found = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      pages(path, found);
      continue;
    }
    if (name === "page.tsx" || name === "page.ts") found.push(relative(root, path));
  }
  return found;
}

const tokens = read("src/styles/vendor/jump-os-ui/jump-os.tokens.css");
const layout = read("src/app/layout.tsx");
const globals = read("src/app/globals.css");
const chrome = read("src/styles/omniroute-chrome.css");
const pkg = read("package.json");
const screenPages = pages(join(root, "src/app")).sort();

describe("Jump OS chrome", () => {
  it("vendors the amber token CSS without an npm dependency", () => {
    assert.match(tokens, /204d6c924e8a1adbdc9b667a461e7f304f7a701e/);
    assert.match(tokens, /--jos-canvas: #000000;/);
    assert.match(tokens, /--jos-canvas: #ffffff;/);
    assert.match(tokens, /--jos-ink: #ffffff;/);
    assert.match(tokens, /--jos-ink: #000000;/);
    assert.match(tokens, /--jos-accent-fill: #f6c445;/);
    assert.match(tokens, /--jos-accent-on-fill: #000000;/);
    assert.match(tokens, /--jos-accent-ink: #7a4e00;/);
    assert.match(tokens, /--jos-accent-ink: #f6c445;/);
    assert.match(tokens, /--jos-status-warning-text: #9a3412;/);
    assert.match(tokens, /--jos-status-warning-text: #f6c7a8;/);
    assert.equal(tokens.includes("#f6c445;") && tokens.includes("--jos-status-warning-text: #f6c445;"), false);
    assert.doesNotMatch(pkg, /@jumpstartscaling\/ui-/);
    assert.match(read("src/styles/vendor/jump-os-ui/jos-ui.css"), /@import "\.\/jump-os\.tokens\.css"/);
    assert.doesNotMatch(read("src/styles/vendor/jump-os-ui/jos-ui.css"), /@jumpstartscaling\/ui-tokens/);
  });

  it("applies the chrome from the root layout that wraps every screen", () => {
    assert.ok(screenPages.length > 100);
    for (const page of screenPages) {
      assert.equal(page.startsWith("src/app/"), true, page);
      assert.equal(page.includes("page.tsx") || page.includes("page.ts"), true);
    }
    assert.match(layout, /import "@\/styles\/vendor\/jump-os-ui\/jos-ui\.css"/);
    assert.match(layout, /import "@\/styles\/omniroute-chrome\.css"/);
    assert.match(layout, /className="jos-ui"/);
    assert.match(layout, /themeColor: "#000000"/);
    assert.match(layout, /setAttribute\('data-theme', 'dark'\)/);
    assert.match(layout, /setAttribute\('data-theme', 'light'\)/);
    assert.match(globals, /--color-bg: #ffffff;/);
    assert.match(globals, /--color-bg: #000000;/);
    assert.match(globals, /--color-text-main: #000000;/);
    assert.match(globals, /--color-text-main: #ffffff;/);
    assert.match(globals, /--color-primary: #f6c445;/);
    assert.match(globals, /--color-accent: #7a4e00;/);
    assert.match(globals, /--color-accent: #f6c445;/);
    assert.match(globals, /--color-warning: #9a3412;/);
    assert.match(globals, /--color-warning: #f6c7a8;/);
    assert.doesNotMatch(globals, /#e54d5e/i);
    assert.doesNotMatch(globals, /#6366f1/i);
  });
});

describe("second pass", () => {
  it("keeps warning off the amber fill and black type on that fill", () => {
    assert.match(chrome, /color: var\(--jos-accent-ink\)/);
    assert.match(chrome, /color: #000000/);
    assert.match(chrome, /background: #9a3412/);
    assert.doesNotMatch(read("src/shared/components/Button.tsx"), /bg-amber-500/);
    assert.match(read("src/shared/components/Button.tsx"), /bg-primary text-black/);
    assert.match(read("src/shared/components/Button.tsx"), /jos-warning-fill/);
    assert.match(read("src/shared/components/Header.tsx"), /border-t-\[#f6c445\]/);
    assert.doesNotMatch(read("src/shared/components/Header.tsx"), /jos-command-strip/);
    const features = read("src/app/landing/components/Features.tsx");
    assert.doesNotMatch(features, /text-sm text-black/);
    assert.match(features, /text-\[#d0d0d0\]/);
    assert.match(features, /bg-\[#f6c445\]/);
    const nav = read("src/app/landing/components/Navigation.tsx");
    assert.match(nav, /bg-\[#f6c445\] hover:bg-\[#e0b03a\] transition-all text-black/);
    assert.match(nav, /OmniRouteLogo size=\{20\} className="text-black"/);
    const brand = /#e54d5e|#6366f1|#8b5cf6/i;
    for (const page of screenPages) {
      assert.equal(brand.test(read(page)), false, page);
    }
  });
});
