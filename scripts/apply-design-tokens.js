#!/usr/bin/env node
/**
 * Script: apply-design-tokens.js
 * Reemplaza valores hardcodeados por design tokens (plan v1.1)
 * Uso: node scripts/apply-design-tokens.js <archivo-o-directorio>
 */

const fs = require('fs');
const path = require('path');

// Cada entrada: { pattern, replacement, jaxPattern (opcional) }
// pattern     → match en StyleSheet / objetos JS (prop: "valor")
// jsxPattern  → match en JSX props (prop="valor" o prop={"valor"})
const TOKEN_MAP = [
  // ── Colores (StyleSheet) ───────────────────────────────────────
  { p: /(color|backgroundColor|borderColor|tintColor|shadowColor)\s*:\s*["']#033563["']/gi,    r: '$1: Colors.primary' },
  { p: /(color|backgroundColor|borderColor|tintColor|shadowColor)\s*:\s*["']#0B4B82["']/gi,    r: '$1: Colors.primaryDark' },
  { p: /(color|backgroundColor|borderColor|tintColor|shadowColor)\s*:\s*["']#1a1a1a["']/gi,    r: '$1: Colors.text.primary' },
  { p: /(color|backgroundColor|borderColor|tintColor|shadowColor)\s*:\s*["']#1A1A1A["']/gi,    r: '$1: Colors.text.primary' },
  { p: /(color|backgroundColor|borderColor|tintColor|shadowColor)\s*:\s*["']#535353["']/gi,    r: '$1: Colors.text.secondary' },
  { p: /(color|backgroundColor|borderColor|tintColor|shadowColor)\s*:\s*["']#8e8e93["']/gi,    r: '$1: Colors.text.secondary' },
  { p: /(color|backgroundColor|borderColor|tintColor|shadowColor)\s*:\s*["']#7D746A["']/gi,    r: '$1: Colors.text.secondary' },
  { p: /(color|backgroundColor|borderColor|tintColor|shadowColor)\s*:\s*["']#2A53A0["']/gi,    r: '$1: Colors.text.accent' },
  { p: /(color|backgroundColor|borderColor|tintColor|shadowColor)\s*:\s*["']#9b1999["']/gi,    r: '$1: Colors.accent' },
  { p: /(color|backgroundColor|borderColor|tintColor|shadowColor)\s*:\s*["']#8A38F5["']/gi,    r: '$1: Colors.accentLight' },
  { p: /(color|backgroundColor|borderColor|tintColor|shadowColor)\s*:\s*["']#D11D3B["']/gi,    r: '$1: Colors.heart' },
  { p: /(color|backgroundColor|borderColor|tintColor|shadowColor)\s*:\s*["']#C48200["']/gi,    r: '$1: Colors.star' },
  { p: /(color|backgroundColor|borderColor|tintColor|shadowColor)\s*:\s*["']#d32f2f["']/gi,    r: '$1: Colors.status.error' },
  { p: /(color|backgroundColor|borderColor|tintColor|shadowColor)\s*:\s*["']#B42318["']/gi,    r: '$1: Colors.status.error' },
  { p: /(color|backgroundColor|borderColor|tintColor|shadowColor)\s*:\s*["']#E8C339["']/gi,    r: '$1: Colors.status.warning' },
  { p: /(color|backgroundColor|borderColor|tintColor|shadowColor)\s*:\s*["']#0E5A2F["']/gi,    r: '$1: Colors.status.success' },
  { p: /(color|backgroundColor|borderColor|tintColor|shadowColor)\s*:\s*["']#e8e8e8["']/gi,    r: '$1: Colors.border' },
  { p: /(color|backgroundColor|borderColor|tintColor|shadowColor)\s*:\s*["']#d9d9d9["']/gi,    r: '$1: Colors.border' },
  { p: /(color|backgroundColor|borderColor|tintColor|shadowColor)\s*:\s*["']#111111["']/gi,    r: '$1: Colors.text.primary' },
  { p: /(color|backgroundColor|borderColor|tintColor|shadowColor)\s*:\s*["']#003A63["']/gi,    r: '$1: Colors.primaryDark' },
  { p: /(color|backgroundColor|borderColor|tintColor|shadowColor)\s*:\s*["']#F2ECE2["']/gi,    r: '$1: Colors.surface' },

  { p: /(color|backgroundColor|borderColor|tintColor|shadowColor)\s*:\s*["']#34B7F1["']/gi, r: '$1: Colors.messageRead' },

  // ── rgba (StyleSheet) ──────────────────────────────────────────
  { p: /(backgroundColor)\s*:\s*["']rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.3\s*\)["']/gi, r: '$1: Colors.surface' },
  { p: /(backgroundColor)\s*:\s*["']rgba\(\s*217\s*,\s*217\s*,\s*217\s*,\s*0\.85\s*\)["']/gi, r: '$1: Colors.surfaceDark' },
  { p: /(backgroundColor|borderColor)\s*:\s*["']rgba\(\s*24\s*,\s*18\s*,\s*10\s*,\s*0\.12\s*\)["']/gi, r: '$1: Colors.border' },

  // ── Colores (JSX props: prop="#hex" o prop={"#hex"}) ───────────
  { p: /(color|tintColor)="#033563"/gi,                                            r: '$1={Colors.primary}' },
  { p: /(color|tintColor)="#0B4B82"/gi,                                            r: '$1={Colors.primaryDark}' },
  { p: /(color|tintColor)="#1a1a1a"/gi,                                            r: '$1={Colors.text.primary}' },
  { p: /(color|tintColor)="#1A1A1A"/gi,                                            r: '$1={Colors.text.primary}' },
  { p: /(color|tintColor)="#111111"/gi,                                            r: '$1={Colors.text.primary}' },
  { p: /(color|tintColor)="#9b1999"/gi,                                            r: '$1={Colors.accent}' },
  { p: /(color)="#d32f2f"/gi,                                                      r: '$1={Colors.status.error}' },
  { p: /(color)="#B42318"/gi,                                                      r: '$1={Colors.status.error}' },
  { p: /(color)="#E8C339"/gi,                                                      r: '$1={Colors.status.warning}' },
  { p: /(color|tintColor)="#34B7F1"/gi,                                            r: '$1={Colors.messageRead}' },
  { p: /(color|tintColor)="#e8e8e8"/gi,                                            r: '$1={Colors.border}' },
  { p: /(color|tintColor)="#d9d9d9"/gi,                                            r: '$1={Colors.border}' },

  // ── Border radius ─────────────────────────────────────────────
  { p: /(borderRadius\w*)\s*:\s*8(?![\d.])/g,                               r: '$1: Radii.sm' },
  { p: /(borderRadius\w*)\s*:\s*14(?![\d.])/g,                              r: '$1: Radii.md' },
  { p: /(borderRadius\w*)\s*:\s*18(?![\d.])/g,                              r: '$1: Radii.lg' },
  { p: /(borderRadius\w*)\s*:\s*24(?![\d.])/g,                              r: '$1: Radii.xl' },

  // ── Spacing ───────────────────────────────────────────────────
  { p: /(padding\w*|margin\w*|gap)\s*:\s*4(?![\d.])/g,                      r: '$1: Spacing.xs' },
  { p: /(padding\w*|margin\w*|gap)\s*:\s*8(?![\d.])/g,                      r: '$1: Spacing.sm' },
  { p: /(padding\w*|margin\w*|gap)\s*:\s*12(?![\d.])/g,                     r: '$1: Spacing.md' },
  { p: /(padding\w*|margin\w*|gap)\s*:\s*16(?![\d.])/g,                     r: '$1: Spacing.lg' },
  { p: /(padding\w*|margin\w*|gap)\s*:\s*24(?![\d.])/g,                     r: '$1: Spacing.xl' },
  { p: /(padding\w*|margin\w*|gap)\s*:\s*32(?![\d.])/g,                     r: '$1: Spacing.xxl' },

  // ── Typography ────────────────────────────────────────────────
  { p: /(fontSize)\s*:\s*11(?![\d.])/g,                                      r: '$1: Typography.sizes.xs' },
  { p: /(fontSize)\s*:\s*13(?![\d.])/g,                                      r: '$1: Typography.sizes.sm' },
  { p: /(fontSize)\s*:\s*14(?![\d.])/g,                                      r: '$1: Typography.sizes.md' },
  { p: /(fontSize)\s*:\s*16(?![\d.])/g,                                      r: '$1: Typography.sizes.lg' },
  { p: /(fontSize)\s*:\s*18(?![\d.])/g,                                      r: '$1: Typography.sizes.xl' },
  { p: /(fontSize)\s*:\s*22(?![\d.])/g,                                      r: '$1: Typography.sizes.xxl' },
];

const THEME_IMPORT = "import { Colors, Spacing, Radii, Typography } from '@/src/core/theme';";

function needsImport(content) {
  return (
    content.includes('Colors.') ||
    content.includes('Spacing.') ||
    content.includes('Radii.') ||
    content.includes('Typography.')
  );
}

function insertImport(content) {
  const hasImport = /from ['"]@\/src\/core\/theme['"]/.test(content);
  if (hasImport) return content;

  if (!needsImport(content)) return content;

  const lines = content.split('\n');
  let insertAfter = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/from\s+['"]/.test(lines[i])) {
      insertAfter = i;
    }
  }

  if (insertAfter >= 0) {
    lines.splice(insertAfter + 1, 0, THEME_IMPORT);
  } else if (lines[0] && /^#!/.test(lines[0])) {
    lines.splice(1, 0, THEME_IMPORT);
  } else {
    lines.unshift(THEME_IMPORT);
  }

  return lines.join('\n');
}

function applyTokens(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  for (const { p: pattern, r: replacement } of TOKEN_MAP) {
    pattern.lastIndex = 0;
    if (pattern.test(content)) {
      pattern.lastIndex = 0;
      content = content.replace(pattern, replacement);
      modified = true;
    }
  }

  if (modified) {
    content = insertImport(content);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  + ${path.relative(process.cwd(), filePath)}`);
    return true;
  }
  return false;
}

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (file === 'node_modules' || file[0] === '.') continue;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath, callback);
    } else if (stat.isFile() && /\.(tsx?|jsx?)$/.test(file)) {
      callback(fullPath);
    }
  }
}

function main() {
  const target = process.argv[2];
  if (!target) {
    console.log('Usage: node scripts/apply-design-tokens.js <file-or-directory>');
    process.exit(1);
  }

  const targetPath = path.resolve(target);
  console.log(`Apply design tokens in: ${targetPath}\n`);

  let modified = 0;
  let scanned = 0;

  if (fs.statSync(targetPath).isDirectory()) {
    walkDir(targetPath, (filePath) => {
      scanned++;
      if (applyTokens(filePath)) modified++;
    });
  } else {
    scanned = 1;
    if (applyTokens(targetPath)) modified++;
  }

  console.log(`\nDone: ${scanned} scanned, ${modified} tokenized`);
}

main();
