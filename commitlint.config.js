export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
      ],
    ],
    'body-max-line-length': [2, 'always', 100],
  },
  ignores: [
    (message) => message.includes('chore(release):'),
    (message) => message.includes('[skip ci]'),
  ],
};