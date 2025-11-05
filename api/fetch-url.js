// Vercel Serverless Function to fetch URL content and avoid CORS
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Fetch the URL content with proper headers
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Failed to fetch URL: ${response.statusText}`
      });
    }

    // Get the HTML content
    const html = await response.text();

    // Return the HTML content
    return res.status(200).json({
      html,
      contentType: response.headers.get('content-type'),
      status: response.status
    });

  } catch (error) {
    console.error('Fetch URL error:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error'
    });
  }
}
