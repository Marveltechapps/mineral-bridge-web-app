import '@testing-library/jest-dom/vitest';

// jsdom has no layout engine, so the scroll-to-top the design performs on every
// navigation is a no-op here.
window.scrollTo = () => {};
