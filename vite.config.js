import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

function servePortfolioMedia(server) {
  server.middlewares.use((req, res, next) => {
    if (!req.url.startsWith('/media/')) {
      return next();
    }

    try {
      // Strip /media/ and clean query params
      const cleanUrl = req.url.replace(/^\/media\//, '').split('?')[0];
      const decodedPath = decodeURIComponent(cleanUrl);
      const fullPath = path.join(__dirname, 'Editing portfolio edits', decodedPath);

      if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
        return next();
      }

      const stat = fs.statSync(fullPath);
      const fileSize = stat.size;
      const range = req.headers.range;

      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(fullPath, { start, end });
        const head = {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        file.pipe(res);
      } else {
        const head = {
          'Content-Length': fileSize,
          'Content-Type': 'video/mp4',
          'Accept-Ranges': 'bytes',
        };
        res.writeHead(200, head);
        fs.createReadStream(fullPath).pipe(res);
      }
    } catch (err) {
      console.error('Error serving video:', err);
      next();
    }
  });
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-portfolio-videos',
      configureServer: servePortfolioMedia,
      configurePreviewServer: servePortfolioMedia,
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 3000,
    host: true,
  }
});
