// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Node.js의 'path' 모듈을 가져옵니다.
import svgr from 'vite-plugin-svgr'; // 1. svgr 플러그인 import

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), svgr()],
    // ----- 이 부분을 추가하거나 확인하세요 -----
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },

    // ------------------------------------
});
