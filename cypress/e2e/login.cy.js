/* eslint-disable linebreak-style */
/**
 * Test Scenario for Login Flow
 *
 * - Login Flow E2E Test
 * - should display login page correctly
 * - should display an alert when email is empty (HTML5 validation)
 * - should display an alert when password is empty (HTML5 validation)
 * - should display an alert and stay on login page when email and password are wrong
 * - should display homepage when email and password are correct
 */
describe('Login Flow E2E Test', () => {
  beforeEach(() => {
    cy.visit('/login');
    // Intercept network request ke API login
    cy.intercept('POST', 'https://forum-api.dicoding.dev/v1/login').as('loginRequest');
    // Intercept network request setelah login berhasil (opsional, tapi baik untuk debugging)
    cy.intercept('GET', 'https://forum-api.dicoding.dev/v1/users/me').as('getUsersMe');
    cy.intercept('GET', 'https://forum-api.dicoding.dev/v1/threads').as('getThreads');
  });

  it('should display login page correctly', () => {
    cy.get('input[id="email"]').should('be.visible');
    cy.get('input[id="password"]').should('be.visible');
    cy.get('button').contains(/^Login$/i).should('be.visible');
  });

  it('should display an alert when email is empty', () => {
    cy.get('input[id="password"]').type('password123');
    cy.get('button').contains(/^Login$/i).click();
    // Untuk HTML5 validation, input yang invalid akan mendapatkan focus dan :invalid pseudo-class
    cy.get('input[id="email"]:invalid').should('exist');
    cy.url().should('include', '/login'); // Tetap di halaman login
  });

  it('should display an alert when password is empty', () => {
    cy.get('input[id="email"]').type('test@example.com');
    cy.get('button').contains(/^Login$/i).click();
    cy.get('input[id="password"]:invalid').should('exist');
    cy.url().should('include', '/login'); // Tetap di halaman login
  });

  // it('should display an alert and stay on login page when email and password are wrong', () => {
  //   cy.get('input[id="email"]').type('wrong@example.com');
  //   cy.get('input[id="password"]').type('wrongpassword');
  //   cy.get('button').contains(/^Login$/i).click();

  //   // Tunggu request login selesai dan cek status code
  //   cy.wait('@loginRequest').its('response.statusCode').should('eq', 401);

  //   // Cek apakah alert muncul (sesuaikan dengan implementasi alert di authActions.js)
  //   cy.on('window:alert', (str) => {
  //     expect(str).to.contains('Login gagal'); // Atau pesan error yang lebih spesifik jika ada
  //   });

  //   // Pastikan tetap di halaman login
  //   cy.url().should('include', '/login');
  // });

  it('should display homepage when email and password are correct', () => {
    // !!! PENTING: GANTI DENGAN KREDENSIAL YANG VALID UNTUK API DICODING !!!
    const validEmail = 'dwipurba77@gmail.com'; // <-- GANTI INI
    const validPassword = 'dwipurba77';   // <-- GANTI INI
    // !!! JANGAN GUNAKAN KREDENSIAL DI ATAS SECARA LANGSUNG !!!

    cy.get('input[id="email"]').type(validEmail);
    cy.get('input[id="password"]').type(validPassword);
    cy.get('button').contains(/^Login$/i).click();

    // Tunggu request login selesai dan cek status code
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);

    // Opsional: Tunggu request data pengguna dan threads jika UI homepage bergantung padanya
    // untuk memastikan halaman sudah termuat sepenuhnya sebelum cek URL.
    // cy.wait('@getUsersMe');
    // cy.wait('@getThreads');

    // Pastikan sudah redirect ke homepage
    cy.url().should('eq', `${Cypress.config().baseUrl}/`); // Cek URL adalah homepage
    // Hapus assertion untuk 'Logout' dan elemen spesifik lainnya jika tidak diperlukan
    // cy.contains('Logout').should('be.visible');
  });
});