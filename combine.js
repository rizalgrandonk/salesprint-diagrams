const fs = require('fs');
const path = require('path');

// Function to combine .mmd files with filenames
function combineMmdFiles(inputDir, outputFile) {
    // Read all files in the input directory
    fs.readdir(inputDir, (err, files) => {
        if (err) {
            console.error("Error reading directory:", err);
            return;
        }

        let combinedContent = '';

        // Iterate over each file and read its content
        files.forEach(file => {
            if (path.extname(file) === '.mmd') { // Process only .mmd files
                const filePath = path.join(inputDir, file);
                const fileContent = fs.readFileSync(filePath, 'utf8');
                combinedContent += `${file}\n`; // Add filename and extra newline for separation
            }
        });

        // Write combined content to the output file
        fs.writeFileSync(outputFile, combinedContent, 'utf8');
        console.log(`Combined content written to ${outputFile}`);
    });
}

// Example usage
const inputDirectory = './sequence'; // Replace with your input directory path
const outputFilePath = './listSequence.mmd'; // Replace with your desired output file path

combineMmdFiles(inputDirectory, outputFilePath);
