module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-cyan': '#00FFFF',
        'neon-pink': '#FF00FF',
        'neon-green': '#00FF00',
        'neon-purple': '#9B59B6',
        'neon-blue': '#3498DB',
        'neon-yellow': '#FFEB3B',
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'matrix-rain': 'matrix-rain 10s linear infinite',
      }
    },
  },
  plugins: [],
}
