import fs from 'fs';
import path from 'path';
import { ViteDevServer } from 'vite';

const base = process.env.BASE || '/';

export class DevSSR {
  viteServer!: ViteDevServer;

  async createViteServer() {
    const { createServer } = await import('vite');

    const viteServer = await createServer({
      server: { middlewareMode: true },
      appType: 'custom',
      base,
    });

    this.viteServer = viteServer;
    return viteServer;
  }

  async createTemplateHTML(url: string, templatePath: string, componentPath: string) {
    if (!this.viteServer) {
      throw new Error('Vite server failed to start!');
    }

    const template = fs.readFileSync(path.resolve(import.meta.dirname, templatePath), 'utf-8');
    const templateHTML = await this.viteServer.transformIndexHtml(url, template);
    const render = (await this.viteServer.ssrLoadModule(componentPath)).render;
    const rendered = await render(url);

    const html = templateHTML
      .replace('<!--app-head-->', rendered.head ?? '')
      .replace('<!--app-html-->', rendered.html ?? '')
      .replace('<!--app-styles-->', rendered.styleTags ?? '');
    // .replace('<!--initial-data-->', `<script>window.__INITIAL_DATA__ = ${JSON.stringify(dataToPass)}</script>`);

    return html;
  }
}
