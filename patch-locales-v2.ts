import fs from 'fs';
import path from 'path';

const localesDir = 'src/i18n/locales';
const files = fs
    .readdirSync(localesDir)
    .filter((f) => f.endsWith('.ts') && f !== 'index.ts');

// This template uses English for now, which is acceptable as a fallback
const noDiagramTemplate = `
                no_diagram: {
                    title: 'No Diagram Open',
                    description: 'Please create a diagram first before adding tables.',
                    create_diagram: 'Create Diagram',
                    close: 'Cancel',
                },`;

for (const file of files) {
    const filePath = path.join(localesDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Find the end of tables_section or a likely insertion point
    if (!content.includes('no_diagram:')) {
        console.log(`Patching ${file}...`);
        // Try inserting after show_all or before table:
        if (content.includes('show_all:')) {
            content = content.replace(
                /show_all: ['"][^'"]+['"],/,
                `show_all: 'Show all',${noDiagramTemplate}`
            );
        } else {
            console.warn(`Could not patch ${file}, show_all not found.`);
        }
        fs.writeFileSync(filePath, content);
    }
}
console.log('Done!');
