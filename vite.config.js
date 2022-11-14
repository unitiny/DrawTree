import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    plugins: [
        vue(),
    ],
    server: {
        proxy: {
            '/loadFile': {
                target: 'https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15',	//实际请求地址
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/loadFile/, '')
            },
            '/serverless': {
                target: 'https://chat-chat-eerndkjruc.cn-hangzhou.fcapp.run',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/serverless/, '')
            },
            '/socket': {
                target: 'ws://127.0.0.1:9000',
                ws: true,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/socket/, '')
            },
        }
    }
})
