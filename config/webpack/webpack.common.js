const path = require('path');
const { projectDirectory } = require('../paths');

module.exports = {
    target: 'node',
    entry: {
        app: path.join(projectDirectory, '/src/index.ts'),
    },
    node: {
        __dirname: false,
        __filename: false,
    },

    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: [
                    path.resolve(__dirname, "./jest.setup.ts"),
                    path.resolve(__dirname, "./jest.config.ts"),
                ],
            },
            {
                test: /\.node$/,
                loader: "node-loader",
            },
            {
                test: /\.test.ts$/,
                loader: 'ignore-loader'
            }
        ],
    },
    resolve: {
        extensions: ['.json', '.ts', '.js'],
        alias: {
            "@Shared": path.join(projectDirectory, '../_shared/src/'),
        },
    },
    output: {
        filename: 'index.js',
        path: path.resolve(projectDirectory, 'lib'),
    },
};
