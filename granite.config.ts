import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'balancegame',
  brand: {
    displayName: '밸런스게임',
    primaryColor: '#E85D04',
    icon: 'https://raw.githubusercontent.com/sssoolleee-art/balance-game/main/public/icon.png',
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
