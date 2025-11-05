import { Tabs } from './Tabs';

interface MarkdownPreviewProps {
  markdown: string;
}

export function MarkdownPreview({ markdown }: MarkdownPreviewProps) {
  const renderMarkdown = (md: string) => {
    // Simple markdown to HTML conversion for preview
    let html = md;

    // Escape HTML
    html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Headers
    html = html.replace(/^### (.*?)$/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h1 class="text-3xl font-bold mt-6 mb-4">$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong class="font-bold">$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    html = html.replace(/_(.+?)_/g, '<em class="italic">$1</em>');

    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-50 border-2 border-black p-4 rounded-none overflow-x-auto my-2"><code>$1</code></pre>');

    // Inline code
    html = html.replace(/`(.*?)`/g, '<code class="bg-gray-50 border border-black px-2 py-1 rounded-none font-mono text-sm">$1</code>');

    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-black hover:underline font-medium">$1</a>');

    // Lists
    html = html.replace(/^\* (.*?)$/gm, '<li class="ml-6 list-disc">$1</li>');
    html = html.replace(/^- (.*?)$/gm, '<li class="ml-6 list-disc">$1</li>');
    html = html.replace(/^\d+\. (.*?)$/gm, '<li class="ml-6 list-decimal">$1</li>');

    // Blockquotes
    html = html.replace(/^&gt; (.*?)$/gm, '<blockquote class="border-l-4 border-black pl-4 italic my-2 text-gray-600">$1</blockquote>');

    // Paragraphs
    html = html.replace(/\n\n/g, '</p><p class="my-2 leading-relaxed">');
    html = '<p class="my-2 leading-relaxed">' + html + '</p>';

    // Line breaks
    html = html.replace(/\n/g, '<br />');

    return html;
  };

  const tabs = [
    {
      id: 'preview',
      label: 'Preview',
      content: (
        <div
          className="prose max-w-none text-black"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }}
        />
      ),
    },
    {
      id: 'source',
      label: 'Source',
      content: (
        <pre className="bg-gray-50 border-2 border-black p-4 rounded-none overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm">
          {markdown}
        </pre>
      ),
    },
  ];

  return <Tabs tabs={tabs} defaultTab="preview" />;
}
