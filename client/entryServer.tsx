import App from '@/src/App';
import { renderToString } from 'react-dom/server';

export function render(url: string, _ssrManifest: string | undefined) {
  console.log(url);
  return renderToString(<App />);
}
