import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Distinct port per app, and away from 5173.
    //
    // 5173 is Vite's default, so anything else running locally grabs it —
    // and on macOS `localhost` resolves to IPv6 ::1 first. If another dev
    // server is bound to [::1]:5173, http://localhost:5173 silently serves
    // that one instead of this app, which looks like a blank page.
    //
    // strictPort makes a collision fail loudly rather than sliding to the
    // next free port, which is the same silent-wrong-page problem.
    port: 5180,
    strictPort: true,
    host: '127.0.0.1',
  },
});
