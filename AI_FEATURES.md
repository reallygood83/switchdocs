# AI Content Organization Features

## Overview

MarkItDown now includes **AI-powered content organization** using **xAI's Grok** model. This feature allows you to automatically restructure, summarize, and optimize your converted Markdown content, with special support for **Korean language** documents.

## Features

### 🤖 AI Organization Modes

1. **Restructure (재구성)**
   - Improves logical flow and reorganizes paragraphs
   - Groups related content together
   - Creates clear heading hierarchies
   - Optimized for both Korean and English content

2. **Summarize (요약)**
   - Creates concise summaries (20-30% of original length)
   - Preserves core messages and key details
   - Perfect for executive summaries
   - Maintains context and important information

3. **Extract Key Points (핵심 포인트 추출)**
   - Extracts important information as bullet points
   - Sorted by importance
   - Great for quick scanning
   - Ideal for meeting notes and reports

4. **Translate & Organize (번역 및 구조화)**
   - Translates between Korean and English
   - Simultaneously restructures content
   - Uses natural language expressions
   - Maintains professional tone

5. **Clean & Format (정리 및 형식화)**
   - Removes redundancies and duplicates
   - Fixes typos and formatting inconsistencies
   - Applies consistent Markdown styling
   - Optimizes whitespace and structure

### 🌏 Korean Language Support

- **Auto-detection**: Automatically detects Korean content
- **Optimized prompts**: Korean-specific AI prompts for better results
- **Bilingual interface**: UI adapts based on content language
- **Mixed content**: Handles documents with both Korean and English

## Getting Started

### 1. Set Up Your xAI API Key

1. Go to [console.x.ai](https://console.x.ai)
2. Sign in or create an account
3. Navigate to the API Keys section
4. Create a new API key
5. In MarkItDown:
   - Click the **Settings** button (⚙️)
   - Paste your API key
   - Click **Validate** to test
   - Click **Save**

**Privacy Note**: Your API key is stored locally in your browser and never sent to our servers.

### 2. Convert a Document

First, convert a document to Markdown using any supported format:
- Upload a PDF, DOCX, or other document
- Or enter a website URL
- Click "Convert to Markdown"

### 3. Organize with AI

Once you have Markdown content:
1. The **AI Content Organization** panel appears below the output
2. Select an organization mode from the dropdown
3. (Optional) For translation, select target language
4. Click **"Organize with AI"** (AI로 구조화)
5. Wait for the AI to process (streaming real-time results)

### 4. Review and Export

- **View organized content** in the preview
- **Compare** original vs organized using the "Comparison" button
- **Copy** the organized content to clipboard
- **Download** as a .md file
- **Start Over** to try different organization modes

## Usage Example

### Converting and Organizing a Korean PDF

```bash
# 1. Start the application
cd mark-it-down-converter
npm run dev

# 2. Open http://localhost:5173
```

**In the browser:**

1. **Upload PDF**: Drop your Korean PDF file
2. **Convert**: Click "Convert to Markdown"
3. **Organize**:
   - Select "Summarize (요약)" mode
   - Click "AI로 구조화"
   - Watch real-time AI generation
4. **Export**: Click "Copy" or "Download"

### API Configuration

```typescript
// Stored locally in browser
localStorage.setItem('xai_api_key', 'your-api-key-here');
```

## API Pricing

xAI Grok API pricing (as of 2025):
- **Input tokens**: $3 per million tokens
- **Output tokens**: $15 per million tokens

**Estimated costs:**
- Small document (1,000 words): ~$0.01-0.02
- Medium document (5,000 words): ~$0.05-0.10
- Large document (20,000 words): ~$0.20-0.40

## Technical Details

### Architecture

```
User Input → MarkItDown Converter → Markdown
                                        ↓
                              AI Organization Panel
                                        ↓
                           xAI Grok API (Streaming)
                                        ↓
                              Organized Content
```

### Files Added

- `src/types/xai.ts` - TypeScript types for xAI integration
- `src/lib/xai-client.ts` - xAI API client
- `src/lib/language-detector.ts` - Korean language detection
- `src/lib/content-organizer.ts` - AI organization logic
- `src/hooks/useContentOrganizer.ts` - React hook for AI features
- `src/components/SettingsModal.tsx` - API key configuration
- `src/components/AIOrganizationPanel.tsx` - Organization controls
- `src/components/ComparisonView.tsx` - Side-by-side comparison

### Korean Text Detection

The system uses Unicode ranges to detect Korean content:
- **Hangul Syllables**: AC00–D7AF
- **Hangul Jamo**: 1100–11FF
- **Hangul Compatibility Jamo**: 3130–318F

If Korean content exceeds 30% of the document, Korean-optimized prompts are used.

## Troubleshooting

### "xAI API key not configured"

**Solution**: 
1. Click the Settings button (⚙️)
2. Add your xAI API key
3. Click Validate and Save

### "Failed to organize content"

**Possible causes:**
- Invalid or expired API key
- Network connectivity issues
- API rate limits exceeded
- Document too large (>50,000 tokens)

**Solution**:
1. Check your internet connection
2. Validate your API key in Settings
3. Try with a smaller document first
4. Check xAI console for API status

### Slow Processing

**Normal behavior:**
- First conversion may take 3-5 seconds (library loading)
- Large documents (20+ pages) may take 10-30 seconds
- Streaming shows real-time progress

**If unusually slow:**
- Check network speed
- Try a smaller document
- Check xAI API status

### Korean Characters Display Issues

**Solution**:
- Ensure your browser supports Unicode
- Update your browser to the latest version
- Check font rendering settings

## Best Practices

1. **Start with smaller documents** to test
2. **Validate API key** before processing large files
3. **Use appropriate modes** for your content type
4. **Compare results** using the Comparison view
5. **Save organized content** immediately after processing
6. **Monitor API usage** in your xAI console

## Examples

### Before Organization (Original Korean Text)

```markdown
프로젝트 관리 도구

우리는 새로운 프로젝트 관리 도구를 개발했습니다.
이 도구는 팀 협업을 향상시킵니다.
다양한 기능이 있습니다.
작업 추적, 일정 관리, 파일 공유 등이 포함됩니다.
사용하기 쉽습니다.
```

### After "Restructure" Mode

```markdown
# 프로젝트 관리 도구

## 개요
우리는 팀 협업을 향상시키는 새로운 프로젝트 관리 도구를 개발했습니다.

## 주요 기능
- **작업 추적**: 프로젝트 진행 상황을 실시간으로 모니터링
- **일정 관리**: 마감일과 마일스톤 관리
- **파일 공유**: 팀원 간 문서 공유 및 협업

## 장점
사용자 친화적인 인터페이스로 누구나 쉽게 사용할 수 있습니다.
```

### After "Summarize" Mode

```markdown
# 프로젝트 관리 도구 요약

팀 협업 향상을 위한 새로운 프로젝트 관리 도구입니다. 
작업 추적, 일정 관리, 파일 공유 기능을 제공하며 
사용자 친화적인 인터페이스를 갖추고 있습니다.
```

## Future Enhancements

- [ ] Custom AI prompts
- [ ] Batch processing for multiple documents
- [ ] Organization history and favorites
- [ ] Multi-language support (beyond Korean/English)
- [ ] Fine-tuned models for specific content types
- [ ] Offline mode with local models

## Support

For issues or questions:
1. Check the [TESTING.md](./TESTING.md) guide
2. Review the [README.md](./README.md)
3. Check xAI documentation: [docs.x.ai](https://docs.x.ai)

## Credits

- **xAI Grok**: AI model for content organization
- **MarkItDown**: Microsoft's markdown conversion library
- Built with React, TypeScript, and Tailwind CSS
