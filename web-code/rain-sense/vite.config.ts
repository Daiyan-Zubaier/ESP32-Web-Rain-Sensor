import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const TUNNEL = env.VITE_TUNNEL_URL;

  return {
    server: {
      host: '::',
      port: 8080,
      proxy: {
        '/api': {
          target: TUNNEL,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  };
});
