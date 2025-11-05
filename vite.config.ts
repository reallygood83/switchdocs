import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-fetch-url',
      configureServer(server) {
        server.middlewares.use('/api/fetch-url', async (req, res) => {
          if (req.method !== 'POST') {
            res.statusCode = 405;
            res.end(JSON.stringify({ error: 'Method not allowed' }));
            return;
          }

          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });

          req.on('end', async () => {
            try {
              const { url } = JSON.parse(body);

              if (!url) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'URL is required' }));
                return;
              }

              // Fetch the URL
              const response = await fetch(url, {
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                  'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
                },
              });

              if (!response.ok) {
                res.statusCode = response.status;
                res.end(JSON.stringify({ error: `Failed to fetch: ${response.statusText}` }));
                return;
              }

              const html = await response.text();

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({ html }));
            } catch (error) {
              res.statusCode = 500;
              res.end(JSON.stringify({
                error: error instanceof Error ? error.message : 'Unknown error'
              }));
            }
          });
        });
      },
    },
  ],
})
