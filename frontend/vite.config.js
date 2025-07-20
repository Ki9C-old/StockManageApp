import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true,
    watch: {
      usePolling: true,  // ファイル変更監視をポーリングに切り替え
      interval: 100      // 監視間隔（ミリ秒）
    }
  }
})
