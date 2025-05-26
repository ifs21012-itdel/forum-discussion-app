/* eslint-disable linebreak-style */
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000', // Sesuaikan dengan port aplikasi Anda
    supportFile: false, // Atau arahkan ke support file jika ada
    video: false, // Matikan perekaman video untuk CI jika tidak diperlukan
    // setupNodeEvents(on, config) {
    //   // implement node event listeners here
    // },
  },
});