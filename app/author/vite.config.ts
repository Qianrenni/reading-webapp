import { defineConfig, loadEnv } from 'vite';
import path from 'path';
import { createGugaViteConfig } from '@guga-reading/config';
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return createGugaViteConfig({
    base: '/author/',
    port: 8081,
    host: 'localhost',
    srcDir: path.resolve(__dirname, 'src'),
    env,
  });
});
