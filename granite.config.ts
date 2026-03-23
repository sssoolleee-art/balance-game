import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'balancegame',
  brand: {
    displayName: '마이너리티 게임',
    primaryColor: '#E85D04',
    icon: 'https://via.placeholder.com/128x128/E85D04/FFFFFF?text=L',
  },
  web: {
    host: 'localhost',
    port: 5178,
    commands: {
      dev: 'vite',
      build: 'vite build',
    },
  },
  permissions: [],
});
