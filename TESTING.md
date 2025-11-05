# Testing Guide

## Testing PDF Conversion (FIXED)

The application now uses PDF.js from CDN for full client-side PDF text extraction. This version is much more reliable.

### Quick Test with Salesforce PDF

1. **Start the dev server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

2. **Open the application in your browser:**
   - Go to `http://localhost:5173`
   - You should see the MarkItDown converter interface

3. **Test PDF Conversion:**
   - Select **"PDF File"** from the Input Type dropdown
   - Either:
     - **Drag and drop** `/Users/heomin/Downloads/salesforce.pdf` onto the file area, OR
     - **Click browse** and navigate to the Salesforce PDF
   - Click **"Convert to Markdown"**
   - **Wait** for the conversion (PDF.js loads from CDN first time, then processes)

4. **Expected Output:**
   - ✅ Document header with filename: `# salesforce.pdf`
   - ✅ Metadata: Number of pages and file size
   - ✅ Separator line
   - ✅ Text extracted from each page (labeled `## Page 1`, `## Page 2`, etc.)
   - ✅ Note if PDF has more than 50 pages

5. **What you can do next:**
   - 📋 Click **"Copy"** to copy the Markdown to clipboard
   - 💾 Click **"Download"** to save as a `.md` file
   - 👁️ Switch between **"Preview"** and **"Source"** tabs to see formatted vs raw Markdown
   - 🔄 Click **"Reset"** to convert another document

### Testing Other File Types

**Websites (URLs):**
- Select "Website URL"
- Enter a URL like `https://example.com`
- Click Convert

**HTML Files:**
- Select "HTML File"
- Upload an .html file
- The HTML will be converted to formatted Markdown

### Browser Testing File

An additional test file `test-pdf.html` is available:
```bash
open test-pdf.html
```
This provides a standalone HTML tool to test PDF conversion without running the full app.

## Troubleshooting

### PDF Conversion Hangs or Fails

1. **Check browser console** (F12 → Console tab) for error messages
2. **Internet connection**: PDF.js and worker load from CDN, so you need internet access
3. **PDF file size**: Large PDFs (>100MB) may be slow but will work
4. **Browser memory**: Try a smaller PDF first if browser crashes
5. **First conversion slower**: First conversion is slower as it downloads PDF.js library (~3-5MB)

### Common Errors & Solutions

**Error: "Failed to load PDF.js from CDN"**
- Likely network issue or CDN is down
- Try again in a few moments
- Check internet connection

**Error: "Failed to extract text from PDF"**
- Check browser console for specific error
- Try a different PDF file
- File might be corrupted or in an unsupported format

**Conversion takes too long**
- This is normal for large PDFs (20+ pages)
- First time is slower due to library download
- Subsequent conversions are faster
- For 100+ page PDFs, may take 30-60 seconds

### Still Having Issues?

1. Open Browser DevTools (F12)
2. Go to **Console** tab
3. Try the conversion again
4. Look for error messages - copy and paste them
5. Check the **Network** tab for failed requests to cdnjs.cloudflare.com
6. If PDF.js fails to load, it means network/CDN issue

## Features Tested

- [x] PDF text extraction and conversion
- [x] Multi-page PDF handling (first 50 pages)
- [x] HTML to Markdown conversion
- [x] URL fetching and conversion
- [x] Copy to clipboard functionality
- [x] Download as .md file
- [x] Responsive design
- [x] Error handling and user feedback

## Known Limitations

- **PDF**: Only text extraction (images not converted)
- **Page limit**: First 50 pages extracted from large PDFs
- **DOCX/PPTX/XLSX**: Currently show placeholder (require backend processing)
- **File size**: Browser memory limits apply (typically 2GB max)
- **Worker**: Requires internet connection for PDF.js worker from CDN

## Performance Notes

- First PDF usually takes longer as browser downloads the PDF.js library
- Subsequent conversions are faster
- Large PDFs (20+ pages) may take several seconds
- Text extraction speed depends on PDF structure and complexity
