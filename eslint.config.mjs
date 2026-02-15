import nextConfig from "eslint-config-next";

const eslintConfig = [
    ...nextConfig,
    {
        rules: {
            "@next/next/no-img-element": "off",
        },
    },
    {
        files: ["**/*.ts", "**/*.tsx"],
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": "warn",
        }
    }
];

export default eslintConfig;
