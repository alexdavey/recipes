import { promises as fs } from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const srcDir = path.join(projectRoot, 'static', 'recipes');
const outDir = path.join(projectRoot, 'content', 'recipes');

function slugToTitle(slug) {
  return slug.replace(/[-_]+/g, ' ').trim();
}

function escapeYamlString(value) {
  return String(value ?? '').replace(/"/g, '\\"');
}

function extractTitleAndSubtitle(lines, fallbackTitle) {
  let title = fallbackTitle;
  let subtitle = '';

  if (lines[0]?.startsWith('# ')) {
    title = lines[0].slice(2).trim();
    lines = lines.slice(1);

    while (lines.length > 0 && lines[0].trim() === '') lines = lines.slice(1);

    if (lines[0] && !lines[0].startsWith('#')) {
      subtitle = lines[0].trim();
      lines = lines.slice(1);
    }
  }

  return { title, subtitle, remainingLines: lines };
}

function extractInfoSection(lines) {
  const text = lines.join('\n');
  const infoHeader = /^##\s+info\s*$/im;
  const match = text.match(infoHeader);
  if (!match) return { time: '', makes: '', body: text };

  const startIndex = match.index ?? 0;
  const before = text.slice(0, startIndex);
  const afterHeader = text.slice(startIndex).replace(infoHeader, '').replace(/^\s*\n/, '');

  const nextH2Index = afterHeader.search(/^##\s+/m);
  const infoBody = nextH2Index >= 0 ? afterHeader.slice(0, nextH2Index) : afterHeader;
  const after = nextH2Index >= 0 ? afterHeader.slice(nextH2Index) : '';

  const bullets = infoBody
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line))
    .map((line) => line.replace(/^[-*]\s+/, '').trim());

  return {
    time: bullets[0] ?? '',
    makes: bullets[1] ?? '',
    body: (before + after).trim() + '\n',
  };
}

function normalizeSectionHeadings(body) {
  return body.replace(/^##\s+based on\s*$/gim, '## basedon');
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });

  let entries;
  try {
    entries = await fs.readdir(srcDir, { withFileTypes: true });
  } catch (err) {
    console.error(`No recipes found at ${srcDir}`);
    process.exitCode = 1;
    return;
  }

  const recipeFiles = entries
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .filter((name) => name.endsWith('.md') && !name.startsWith('_'))
    .sort((a, b) => a.localeCompare(b, 'en'));

  if (recipeFiles.length === 0) {
    console.warn(`No .md recipes found in ${srcDir}`);
    return;
  }

  for (const filename of recipeFiles) {
    const slug = filename.replace(/\.md$/, '');
    const fallbackTitle = slugToTitle(slug);

    const srcPath = path.join(srcDir, filename);
    const raw = await fs.readFile(srcPath, 'utf8');
    const lines = raw.split(/\r?\n/);

    const { title, subtitle, remainingLines } = extractTitleAndSubtitle(lines, fallbackTitle);
    const info = extractInfoSection(remainingLines);
    const body = normalizeSectionHeadings(info.body);

    const fm = [
      '---',
      `title: "${escapeYamlString(title)}"`,
      subtitle ? `subtitle: "${escapeYamlString(subtitle)}"` : null,
      info.time ? `time: "${escapeYamlString(info.time)}"` : null,
      info.makes ? `makes: "${escapeYamlString(info.makes)}"` : null,
      '---',
      '',
    ]
      .filter((line) => line !== null)
      .join('\n');

    const outPath = path.join(outDir, `${slug}.md`);
    await fs.writeFile(outPath, fm + body, 'utf8');
  }

  console.log(`Migrated ${recipeFiles.length} recipe(s) to ${outDir}`);
  console.log('Next: delete/move the originals in static/recipes once you are happy with the result.');
}

await main();
