import '@testing-library/jest-dom/vitest';

// UI tests exercise the design demo. The configured app reads VITE_API_BASE_URL
// from .env and must not fall back to these fixtures.
vi.stubEnv('VITE_API_BASE_URL', '');

// jsdom has no layout engine, so the scroll-to-top the design performs on every
// navigation is a no-op here.
window.scrollTo = () => {};
