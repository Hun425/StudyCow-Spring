import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'global': 'window' // 브라우저 환경에서 global을 window로 대체
  },
  server: {
    proxy: {
      '/studycow/api': {
        target: 'https://i11c202.p.ssafy.io/studycow',
        changeOrigin: true,
      },
      // WebSocket 요청을 스프링 부트 서버로 프록시합니다.
      '/studycow/ws-stomp': {
        target: 'https://i11c202.p.ssafy.io', // 스프링 부트 서버의 URL
        changeOrigin: true,
        ws: true, // WebSocket 요청을 프록시합니다.
      },
    }
  }
})
