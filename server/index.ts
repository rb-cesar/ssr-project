import express from 'express';
import path from 'path';
import { DevSSR } from './devSSR';

const baseUrl = process.env.BASE || '/';
// const isProd = process.env.NODE_ENV === 'production';

const app = express();
const devSSR = new DevSSR();
const viteServer = await devSSR.createViteServer();

app.use(viteServer.middlewares);

app.use('/assets', express.static(path.resolve(import.meta.dirname, '../dist/client/assets')));

app.get('/*splat', async (req, res) => {
  const url = req.originalUrl.replace(baseUrl, '/');
  const templatePath = '../client/index.html';
  const componentPath = '../client/entryServer.tsx';
  const html = await devSSR.createTemplateHTML(url, templatePath, componentPath);

  res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`SSR server running at http://localhost:${PORT}`);
});
