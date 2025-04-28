import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**.spec.ts',
    baseUrl: 'http://localhost:3000',
    experimentalRunAllSpecs: true,
    viewportHeight:640,
    viewportWidth:360,
    setupNodeEvents(on, config) {
      
    },
  },
});
