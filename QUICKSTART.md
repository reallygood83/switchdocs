# Quick Start Guide

## 🚀 Start the App

```bash
cd /Users/heomin/mark-it-down-converter
npm run dev
```

Open **http://localhost:5173** in your browser.

## 📄 Basic Usage: Convert Document

### Test with Salesforce PDF

1. **Select Input Type**: Choose `"PDF File"` from the dropdown
2. **Upload File**: Drag & drop `/Users/heomin/Downloads/salesforce.pdf` or click browse
3. **Convert**: Click `"Convert to Markdown"`
4. **Wait**: First conversion takes 3-5 seconds (PDF.js library loading from CDN)
5. **Result**: See extracted text in the preview area

## 🤖 AI Organization (NEW!)

### Setup xAI API Key

1. **Get API Key**: Visit [console.x.ai](https://console.x.ai)
2. **Open Settings**: Click the Settings (⚙️) button in the app
3. **Add Key**: Paste your xAI API key
4. **Validate**: Click "Validate" to test the key
5. **Save**: Click "Save" to store locally

### Organize Content with AI

After converting a document:

1. **Select Mode**: Choose from organization modes:
   - **Restructure (재구성)**: Reorganize paragraphs logically
   - **Summarize (요약)**: Create concise summary
   - **Extract Key Points**: Bullet-point format
   - **Translate & Organize**: Korean ↔ English
   - **Clean & Format**: Remove redundancies

2. **Process**: Click `"Organize with AI"` (AI로 구조화)
3. **Watch**: Real-time streaming shows AI generation
4. **Review**: Compare original vs organized content
5. **Export**: Copy or download the result

### Korean Content Example

1. Convert a Korean PDF to Markdown
2. The app auto-detects Korean language (한국어 콘텐츠가 감지됨)
3. AI uses Korean-optimized prompts
4. Get perfectly restructured Korean content!

## ✨ What You Can Do

| Action | How |
|--------|-----|
| 📋 Copy to Clipboard | Click the `"Copy"` button |
| 💾 Save as .md File | Click the `"Download"` button |
| 👁️ View Preview | Click the `"Preview"` tab |
| 📝 View Raw Markdown | Click the `"Source"` tab |
| 🔄 Try Another File | Click `"Reset"` button |

## 🌐 Other Tests

**Convert Website to Markdown:**
- Select `"Website URL"` 
- Enter `https://example.com`
- Click Convert

**Upload HTML File:**
- Select `"HTML File"`
- Upload an .html file
- HTML gets converted to formatted Markdown

## 🆘 Troubleshooting

**Error: "Failed to load PDF.js"**
→ Check internet connection (needs CDN access)

**Conversion takes long time**
→ Normal for large PDFs (20+ pages). First run slower due to library download.

**Nothing happens after clicking Convert**
→ Open browser DevTools (F12), go to Console tab, look for error messages

## 📊 System Information

- **Location**: `/Users/heomin/mark-it-down-converter`
- **Dev Server**: http://localhost:5173
- **Build Output**: `dist/` folder
- **Tech**: React + TypeScript + Tailwind CSS + PDF.js

## 📦 Commands Reference

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript
```

## ✅ Features Included

- ✅ PDF text extraction (up to 50 pages)
- ✅ Website to Markdown conversion
- ✅ HTML file support
- ✅ Copy to clipboard
- ✅ Download as .md file
- ✅ Real-time preview
- ✅ Responsive design
- ✅ Dark/light mode ready
- ✅ Error handling
- ✅ Loading states

## 🎯 Expected Output Format

```markdown
# salesforce.pdf

**Pages:** 42
**File size:** 21.00 MB

---

## Page 1

[Text extracted from page 1...]

## Page 2

[Text extracted from page 2...]

...

*Note: Only first 50 pages shown. Total pages: 42*
```

---

**Enjoy your Markdown converter! 🎉**
