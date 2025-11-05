import fs from 'fs';
import path from 'path';

// Test PDF conversion directly
async function testPdfConversion() {
  try {
    const pdfPath = '/Users/heomin/Downloads/salesforce.pdf';
    
    if (!fs.existsSync(pdfPath)) {
      console.error('PDF file not found:', pdfPath);
      process.exit(1);
    }

    const fileBuffer = fs.readFileSync(pdfPath);
    const uint8Array = new Uint8Array(fileBuffer);
    
    // Import pdfjs-dist
    const pdfjsLib = await import('pdfjs-dist');
    
    // Set up the worker from CDN
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

    console.log('Loading PDF...');
    const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;
    console.log(`✓ PDF loaded successfully`);
    console.log(`✓ Total pages: ${pdf.numPages}`);

    let fullText = `# salesforce.pdf\n\n`;
    fullText += `**Pages:** ${pdf.numPages}\n`;
    fullText += `**File size:** ${(fileBuffer.length / 1024 / 1024).toFixed(2)} MB\n\n`;
    fullText += '---\n\n';

    // Test extracting first 3 pages
    const pagesToExtract = Math.min(3, pdf.numPages);
    for (let pageNum = 1; pageNum <= pagesToExtract; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const text = textContent.items
        .map((item) => item.str)
        .join(' ');

      console.log(`✓ Extracted page ${pageNum}: ${text.substring(0, 100)}...`);
      
      if (text.trim()) {
        fullText += `## Page ${pageNum}\n\n`;
        fullText += `${text}\n\n`;
      }
    }

    fullText += `\n\n*Only first ${pagesToExtract} pages shown. Total pages: ${pdf.numPages}*`;

    // Save to file for inspection
    fs.writeFileSync('/tmp/salesforce_converted.md', fullText);
    console.log('\n✓ Conversion successful!');
    console.log(`✓ Output saved to /tmp/salesforce_converted.md`);
    console.log(`✓ Output preview (first 500 chars):\n${fullText.substring(0, 500)}`);

  } catch (error) {
    console.error('Error during PDF conversion:', error);
    process.exit(1);
  }
}

testPdfConversion();
