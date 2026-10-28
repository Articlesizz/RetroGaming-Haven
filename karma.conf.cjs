// Configuración de Karma + Jasmine. Las pruebas JSX se compilan con Babel mediante webpack.
// El navegador es Chrome o Edge en modo headless (CHROME_BIN puede indicar la ruta).
const fs = require('node:fs');
const path = require('node:path');

const BROWSER_CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
];

if (!process.env.CHROME_BIN) {
  const found = BROWSER_CANDIDATES.find((candidate) => fs.existsSync(candidate));
  if (found) process.env.CHROME_BIN = found;
}

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'webpack'],
    plugins: ['karma-jasmine', 'karma-webpack', 'karma-chrome-launcher', 'karma-spec-reporter', 'karma-coverage'],
    files: ['tests/**/*.spec.js', 'tests/**/*.spec.jsx'],
    preprocessors: {
      'tests/**/*.spec.js': ['webpack'],
      'tests/**/*.spec.jsx': ['webpack'],
    },
    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      resolve: { extensions: ['.js', '.jsx'] },
      module: {
        rules: [
          // Instrumenta solo el código de src/ (no las pruebas) para medir la cobertura con Istanbul.
          {
            test: /.jsx?$/,
            include: path.resolve(__dirname, 'src'),
            enforce: 'post',
            use: { loader: '@jsdevtools/coverage-istanbul-loader', options: { esModules: true } },
          },
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { targets: { chrome: '100' } }],
                  ['@babel/preset-react', { runtime: 'automatic' }],
                ],
              },
            },
          },
        ],
      },
    },
    webpackMiddleware: { stats: 'errors-only' },
    reporters: ['spec', 'coverage'],
    // Reporte en consola, HTML (coverage/index.html) y JSON resumen (coverage/coverage-summary.json).
    coverageReporter: {
      dir: 'coverage',
      reporters: [{ type: 'text-summary' }, { type: 'html', subdir: 'html' }, { type: 'json-summary', subdir: '.', file: 'coverage-summary.json' }],
      check: { global: { statements: 80, lines: 80, functions: 80, branches: 70 } },
    },
    specReporter: { suppressPassed: false, suppressSkipped: false, showSpecTiming: false },
    browsers: ['ChromeHeadlessCI'],
    customLaunchers: {
      ChromeHeadlessCI: { base: 'ChromeHeadless', flags: ['--no-sandbox'] },
    },
    browserNoActivityTimeout: 60000,
    singleRun: true,
    logLevel: config.LOG_INFO,
  });
};
