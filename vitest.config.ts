import { fileURLToPath } from 'node:url'
import { playwright } from '@vitest/browser-playwright'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config.ts'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      root: fileURLToPath(new URL('./', import.meta.url)),
      projects: [
        {
          extends: true,
          test: {
            name: 'node',
            environment: 'node',
            include: ['src/**/__tests__/**/*.node.spec.ts'],
            exclude: [...configDefaults.exclude, 'e2e/**'],
          },
        },
        {
          extends: true,
          test: {
            name: 'browser',
            include: ['src/**/__tests__/**/*.browser.spec.ts'],
            fileParallelism: false,
            browser: {
              enabled: true,
              headless: true,
              provider: playwright(),
              instances: [{ browser: 'chromium' }],
            },
          },
        },
      ],
    },
  }),
)
