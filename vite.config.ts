import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'zustand',
      '@react-three/fiber',
      '@react-three/drei',
      '@react-three/postprocessing',
      'three',
      'lucide-react',
      '@supabase/supabase-js'
    ],
  },
  resolve: {
    dedupe: ['react', 'react-dom', 'three']
  }
});
