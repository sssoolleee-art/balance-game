import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'balancegame',
  brand: {
    displayName: '밸런스게임',
    primaryColor: '#E85D04',
    icon: 'https://static.toss.im/appsintoss/27863/29b223ba-d79d-4362-8948-9fe838ff764c.png',
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
