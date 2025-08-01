import express from 'express';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import fs from 'fs';
import path from 'path';
import App from '../shared/App';

const isProd = process.env.NODE_ENV === 'production';
const app = express();

app.use('/assets', express.static(path.resolve(import.meta.dirname, '../dist/client/assets')));

app.get('/*splat', async (req, res) => {
  const indexHTML = isProd
    ? fs.readFileSync(path.resolve(import.meta.dirname, '../dist/client/index.html'), 'utf-8')
    : fs.readFileSync(path.resolve(import.meta.dirname, '../client/index.html'), 'utf-8');

  const appHTML = renderToString(createElement(App));
  const html = indexHTML.replace('<!--ssr-outlet-->', appHTML);

  res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`SSR server running at http://localhost:${PORT}`);
});
