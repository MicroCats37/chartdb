import fs from 'fs';
import path from 'path';

const localesDir = 'src/i18n/locales';
const files = fs
    .readdirSync(localesDir)
    .filter((f) => f.endsWith('.ts') && f !== 'index.ts');

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

    if (!content.includes('no_diagram:')) {
        console.log(`Patching ${file}...`);
        content = content.replace(
            "show_all: 'Show all',",
            `show_all: 'Show all',${noDiagramTemplate}`
        );
        fs.writeFileSync(filePath, content);
    }
}
console.log('Done!');
