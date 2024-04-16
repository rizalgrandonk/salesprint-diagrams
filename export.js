const fs = require("fs");
const path = require("path");
const { execSync, exec } = require("child_process");

(async () => {
  // Define the directory where your diagram files are located
  const DIAGRAM_DIR = "./";

  // Define the output directory for the SVG files
  const OUTPUT_DIR = "svg_output";

  // Function to recursively find diagram files in subdirectories
  function findDiagramFiles(directory) {
    let diagramFiles = [];

    // Get a list of all files and directories in the current directory
    const files = fs.readdirSync(directory);

    // Loop through each file/directory
    files.forEach((file) => {
      const filePath = path.join(directory, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        // If the item is a directory, recursively search for diagram files
        diagramFiles = diagramFiles.concat(findDiagramFiles(filePath));
      } else if (path.extname(file) === ".mmd") {
        // If the item is a .mmd file, add it to the list of diagram files
        diagramFiles.push(filePath);
      }
    });

    return diagramFiles;
  }

  // Find all diagram files in the directory
  const allDiagramFiles = findDiagramFiles(DIAGRAM_DIR);

  // Create the output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Convert each diagram file to SVG
  await Promise.all(
    allDiagramFiles.map(async (diagramFile) => {
      const relativePath = path.relative(DIAGRAM_DIR, diagramFile);
      const outputDir = path.join(OUTPUT_DIR, path.dirname(relativePath));
      const outputFile = path.join(
        outputDir,
        `${path.parse(diagramFile).name}.svg`
      );

      // Create the output directory if it doesn't exist
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Convert the diagram to SVG using mermaid-cli
      try {
        console.log(`Start convert ${diagramFile}`);
        await execComand(
          `mmdc -i "${diagramFile}" -o "${outputFile}" -c "mermaid_conf.json" --width 800 --height 600`
        );
        console.log(`Converted ${diagramFile} to SVG`);
      } catch (error) {
        console.error(
          `Error converting ${diagramFile} to SVG: ${error.message}`
        );
      }
    })
  );

  console.log("All diagrams converted to SVG");
})();

async function execComand(comand) {
  return await new Promise((resolve, reject) =>
    exec(comand, (err, out) => {
      if (err) {
        return reject(err);
      }

      return resolve(out);
    })
  );
}
