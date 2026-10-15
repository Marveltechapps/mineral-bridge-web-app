/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Base URL of the Mineral Bridge API, e.g. `https://api.mineralbridge.test/v1`.
   * Baked in at build time, so each environment needs its own build. Unset means
   * no API: the UI runs on the bundled design data.
   */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
