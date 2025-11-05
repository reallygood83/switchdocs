import { FileType } from '../types/index';

export async function convertToMarkdown(input: string | File, sourceType: FileType): Promise<string> {
  try {
    if (sourceType === 'url') {
      return await convertUrlToMarkdown(input as string);
    } else if (sourceType === 'html') {
      return convertHtmlToMarkdown(input as string);
    } else if (input instanceof File) {
      return await convertFileToMarkdown(input, sourceType);
    }
    throw new Error('Unsupported conversion type');
  } catch (error) {
    throw new Error(`Conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function convertUrlToMarkdown(url: string): Promise<string> {
  try {
    // Use proxy API to avoid CORS issues
    const response = await fetch('/api/fetch-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return convertHtmlToMarkdown(data.html);
  } catch (error) {
    throw new Error(`Failed to fetch URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function convertHtmlToMarkdown(html: string): string {
  // Simple HTML to Markdown conversion
  let markdown = html;

  // Headers
  markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
  markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
  markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
  markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');
  markdown = markdown.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n');
  markdown = markdown.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n');

  // Paragraphs
  markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');

  // Line breaks
  markdown = markdown.replace(/<br\s*\/?>/gi, '\n');

  // Bold
  markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');

  // Italic
  markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');

  // Links
  markdown = markdown.replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)');

  // Lists
  markdown = markdown.replace(/<ul[^>]*>(.*?)<\/ul>/gi, (_, content) => {
    const items = content.match(/<li[^>]*>(.*?)<\/li>/gi) || [];
    return items.map((item: string) => {
      const text = item.replace(/<\/?li[^>]*>/gi, '').trim();
      return `- ${text}`;
    }).join('\n') + '\n\n';
  });

  markdown = markdown.replace(/<ol[^>]*>(.*?)<\/ol>/gi, (_, content) => {
    const items = content.match(/<li[^>]*>(.*?)<\/li>/gi) || [];
    return items.map((item: string, index: number) => {
      const text = item.replace(/<\/?li[^>]*>/gi, '').trim();
      return `${index + 1}. ${text}`;
    }).join('\n') + '\n\n';
  });

  // Code blocks
  markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
  markdown = markdown.replace(/<pre[^>]*>(.*?)<\/pre>/gi, '```\n$1\n```\n\n');

  // Blockquotes
  markdown = markdown.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, (_, content) => {
    const lines = content.trim().split('\n');
    return lines.map((line: string) => `> ${line.trim()}`).join('\n') + '\n\n';
  });

  // Tables (basic support)
  markdown = markdown.replace(/<table[^>]*>(.*?)<\/table>/gi, (_, content) => {
    const rows = content.match(/<tr[^>]*>(.*?)<\/tr>/gi) || [];
    if (rows.length === 0) return '';

    const tableRows = rows.map((row: string) => {
      const cells = row.match(/<t[dh][^>]*>(.*?)<\/t[dh]>/gi) || [];
      return '| ' + cells.map((cell: string) => 
        cell.replace(/<\/?t[dh][^>]*>/gi, '').trim()
      ).join(' | ') + ' |';
    });

    if (tableRows.length > 0) {
      const headerRow = tableRows[0];
      const separatorRow = '| ' + headerRow.split('|').slice(1, -1).map(() => '---').join(' | ') + ' |';
      return [headerRow, separatorRow, ...tableRows.slice(1)].join('\n') + '\n\n';
    }
    return '';
  });

  // Remove HTML tags
  markdown = markdown.replace(/<[^>]*>/g, '');

  // Clean up extra whitespace
  markdown = markdown.replace(/\n\n\n+/g, '\n\n').trim();

  return markdown;
}

async function convertFileToMarkdown(file: File, sourceType: FileType): Promise<string> {
  if (sourceType === 'pdf') {
    return await convertPdfToMarkdown(file);
  } else if (sourceType === 'docx') {
    return `# Word Document: ${file.name}\n\n*Note: DOCX conversion requires backend processing.*\n\nFile size: ${formatFileSize(file.size)}`;
  } else if (sourceType === 'pptx') {
    return `# PowerPoint Document: ${file.name}\n\n*Note: PPTX conversion requires backend processing.*\n\nFile size: ${formatFileSize(file.size)}`;
  } else if (sourceType === 'xlsx') {
    return `# Excel Document: ${file.name}\n\n*Note: XLSX conversion requires backend processing.*\n\nFile size: ${formatFileSize(file.size)}`;
  }

  throw new Error(`Unsupported file type: ${sourceType}`);
}

interface PdfTextItem {
  str: string;
}

async function convertPdfToMarkdown(file: File): Promise<string> {
  try {
    // Use the PDF.js library from CDN
    const win = window as unknown as { pdfjsLib?: Record<string, unknown> };
    if (!win.pdfjsLib) {
      // Load PDF.js from CDN
      await loadPdfJs();
    }

    const pdfjsLib = win.pdfjsLib as Record<string, unknown>;
    const globalOptions = pdfjsLib.GlobalWorkerOptions as Record<string, unknown>;
    
    // Set up worker from CDN
    globalOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    
    const arrayBuffer = await file.arrayBuffer();
    const getDocument = pdfjsLib.getDocument as (...args: unknown[]) => { promise: Promise<unknown> };
    const pdf = await getDocument({ data: arrayBuffer }).promise;

    let fullText = `# ${file.name}\n\n`;
    fullText += `**Pages:** ${(pdf as Record<string, unknown>).numPages}\n`;
    fullText += `**File size:** ${formatFileSize(file.size)}\n\n`;
    fullText += '---\n\n';

    // Extract text from each page
    const numPages = (pdf as Record<string, unknown>).numPages as number;
    for (let pageNum = 1; pageNum <= Math.min(numPages, 50); pageNum++) {
      const getPage = pdf as { getPage: (...args: unknown[]) => Promise<unknown> };
      const page = await getPage.getPage(pageNum);
      const getTextContent = page as { getTextContent: (...args: unknown[]) => Promise<unknown> };
      const textContent = await getTextContent.getTextContent();
      const text = ((textContent as Record<string, unknown>).items as PdfTextItem[])
        .map((item: PdfTextItem) => item.str)
        .join(' ');

      if (text.trim()) {
        fullText += `## Page ${pageNum}\n\n`;
        fullText += `${text}\n\n`;
      }
    }

    if (numPages > 50) {
      fullText += `\n\n*Note: Only first 50 pages shown. Total pages: ${numPages}*`;
    }

    return fullText;
  } catch (error) {
    throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function loadPdfJs(): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      resolve();
    };
    script.onerror = () => {
      reject(new Error('Failed to load PDF.js from CDN'));
    };
    document.head.appendChild(script);
  });
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export function detectFileType(filename: string): FileType {
  const ext = filename.split('.').pop()?.toLowerCase();
  const typeMap: { [key: string]: FileType } = {
    'pdf': 'pdf',
    'docx': 'docx',
    'pptx': 'pptx',
    'xlsx': 'xlsx',
    'csv': 'csv',
    'json': 'json',
    'xml': 'xml',
    'html': 'html',
    'htm': 'html',
  };
  return typeMap[ext || ''] || 'html';
}

export function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}
