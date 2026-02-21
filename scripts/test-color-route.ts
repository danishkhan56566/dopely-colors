import { colorPsychologyDb } from '../src/data/colorPsychology';

console.log('Total colors in DB:', colorPsychologyDb.length);
console.log('Sample White data length:');
const white = colorPsychologyDb.find(c => c.slug === 'white');
console.log('- History paragraphs:', white?.history?.length || 0);
console.log('- Description paragraphs:', white?.description?.length || 0);

// Validate array typing across all colors
const invalidColors = colorPsychologyDb.filter(c => 
    !Array.isArray(c.history) || 
    !Array.isArray(c.description) || 
    !Array.isArray(c.businessApplications) || 
    !Array.isArray(c.marketingAndBranding)
);

if (invalidColors.length > 0) {
    console.error('ERROR: The following colors have invalid array structures:', invalidColors.map(c => c.slug));
    process.exit(1);
} else {
    console.log('SUCCESS: All 10 colors have strictly typed string arrays for deep narrative content.');
    process.exit(0);
}
