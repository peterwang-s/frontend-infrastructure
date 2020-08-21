module.exports = {
    trailingComma: 'all',
    tabWidth: 4,
    semi: true,
    singleQuote: true,
    endOfLine: 'auto',
    printWidth: 100,
    proseWrap: 'never',
    overrides: [
        {
            files: '.prettierrc',
            options: {
                parser: 'json',
            },
        },
        {
            files: '*.md',
            options: {
                tabWidth: 2,
            },
        },
    ],
    useTabs: false,
    bracketSpacing: true,
};
