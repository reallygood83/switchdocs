# MarkItDown - AI-Powered Link to Markdown Converter

A sophisticated, standalone webpage that converts links and documents to Markdown format, with **AI-powered content organization** using xAI Grok. Perfect for use with LLMs and text analysis pipelines.

## Features

### Document Conversion
- **URL Conversion**: Convert websites to Markdown by entering their URLs
- **Document Support**: Upload and convert PDF, Word, PowerPoint, Excel, and other file formats
- **Real-time Preview**: See your Markdown in real-time with syntax highlighting
- **Copy & Download**: Easily copy to clipboard or download as .md files
- **Drag & Drop**: Simple drag-and-drop file upload interface

### 🤖 AI Content Organization (NEW!)
- **Restructure**: Improve logical flow and reorganize paragraphs
- **Summarize**: Create concise summaries of your content
- **Extract Key Points**: Identify and list important information
- **Translate & Organize**: Translate between Korean and English while restructuring
- **Clean & Format**: Remove redundancies and improve formatting
- **Korean Language Support**: Optimized prompts for Korean content
- **Real-time Streaming**: Watch AI generate content in real-time

### User Experience
- **Responsive Design**: Works beautifully on desktop and mobile devices
- **Dark Mode Compatible**: Beautiful dark theme support
- **Settings Management**: Secure API key storage in browser

## Supported Formats

**Input Types:**
- 🌐 Website URLs (HTML)
- 📄 HTML Files
- 📕 PDF Documents
- 📘 Word Documents (.docx)
- 🎯 PowerPoint Presentations (.pptx)
- 📊 Excel Spreadsheets (.xlsx)
- 📋 CSV Files
- 📦 JSON Files
- 🏷️ XML Files

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **UI Components**: Custom shadcn-ui inspired components
- **Icons**: Lucide React
- **AI Integration**: xAI Grok API for content organization
- **PDF Processing**: PDF.js for client-side PDF text extraction

## Quick Start

### Basic Usage (Document Conversion)

```bash
cd mark-it-down-converter
npm install
npm run dev
```

Open `http://localhost:5173` and:
1. Upload a document or enter a URL
2. Click "Convert to Markdown"
3. Copy or download your Markdown

### AI Organization (Optional)

To use AI features:

1. **Get xAI API Key**:
   - Visit [console.x.ai](https://console.x.ai)
   - Create an API key

2. **Configure in App**:
   - Click Settings (⚙️) button
   - Paste your API key
   - Click Validate and Save

3. **Organize Content**:
   - Convert a document first
   - Select organization mode
   - Click "Organize with AI"

**See [AI_FEATURES.md](./AI_FEATURES.md) for detailed AI documentation.**

## Getting Started

### Installation

```bash
cd mark-it-down-converter
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
mark-it-down-converter/
├── src/
│   ├── components/          # React components
│   │   ├── ActionButtons.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ConverterForm.tsx
│   │   ├── Input.tsx
│   │   ├── MarkdownPreview.tsx
│   │   ├── Tabs.tsx
│   │   └── Toast.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useClipboard.ts
│   │   └── useMarkdownConverter.ts
│   ├── lib/                 # Utility functions
│   │   └── markitdown.ts
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx              # Main application component
│   ├── index.css            # Global styles
│   └── main.tsx             # Application entry point
├── public/                  # Static assets
├── dist/                    # Production build output
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Project dependencies
```

## How to Use

1. **Convert a Website**: 
   - Select "Website URL" from the Input Type dropdown
   - Enter a URL (e.g., https://example.com)
   - Click "Convert to Markdown"

2. **Convert a Document**:
   - Select the file type from the Input Type dropdown
   - Either drag and drop a file or click to browse
   - Click "Convert to Markdown"

3. **View & Export**:
   - The preview shows your Markdown in real-time
   - Switch between "Preview" and "Source" tabs
   - Click "Copy" to copy to clipboard
   - Click "Download" to save as .md file

## API Reference

### useMarkdownConverter Hook

```typescript
const { isLoading, error, result, convert } = useMarkdownConverter();

// Convert a URL
await convert('https://example.com', 'url');

// Convert a file
const file = new File([...], 'document.pdf');
await convert(file, 'pdf');
```

### convertToMarkdown Function

```typescript
import { convertToMarkdown } from './lib/markitdown';

const markdown = await convertToMarkdown(input, sourceType);
```

## Supported File Types

| Type | Format | Input Type |
|------|--------|-----------|
| Website | URL | `'url'` |
| HTML | .html, .htm | `'html'` |
| PDF | .pdf | `'pdf'` |
| Word | .docx | `'docx'` |
| PowerPoint | .pptx | `'pptx'` |
| Excel | .xlsx | `'xlsx'` |
| CSV | .csv | `'csv'` |
| JSON | .json | `'json'` |
| XML | .xml | `'xml'` |

## Deployment

### Vercel

```bash
vercel deploy
```

### Netlify

```bash
npm run build
# Deploy dist/ folder to Netlify
```

### GitHub Pages

```bash
npm run build
# Push dist/ folder to gh-pages branch
```

## Limitations

- PDF, Word, PowerPoint, and Excel conversion currently provides basic support with file information
- For full-featured conversion of these formats, integration with a backend service using dedicated libraries (like pdf.js, docx, etc.) is recommended
- File upload is limited by browser constraints (typically 2GB for modern browsers)

## Future Enhancements

- [ ] Full PDF text extraction with pdf.js
- [ ] Advanced document conversion with dedicated backend
- [ ] Conversion history and favorites
- [ ] Custom Markdown templates
- [ ] Batch file processing
- [ ] API endpoint for programmatic access
- [ ] Browser extension for one-click conversion

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## License

MIT License - feel free to use this project for any purpose.

## Credits

Built with React, TypeScript, and Tailwind CSS, inspired by the MarkItDown project from Microsoft.
