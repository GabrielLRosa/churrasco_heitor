/********************
 * Jest Config (ESM)
 ********************/

/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: '<rootDir>/tsconfig.jest.json',
        diagnostics: false
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
    '\\.(svg|png|jpg|jpeg|gif)$': 'identity-obj-proxy',
    '^react-icons(/.*)?$': '<rootDir>/src/test/__mocks__/reactIconsMock.cjs',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testMatch: ['**/*.test.(ts|tsx)'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/presentation/components/organisms/ChecklistForm/ChecklistForm.tsx',
    'src/presentation/components/molecules/Modal/Modal.tsx',
    'src/presentation/components/molecules/ChecklistFilters/ChecklistFilters.tsx',
    'src/presentation/components/atoms/Button/Button.tsx',
    'src/presentation/components/atoms/Checkbox/Checkbox.tsx',
    'src/presentation/components/atoms/Toast/Toast.tsx',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
};

export default config;