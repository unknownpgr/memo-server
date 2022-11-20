/** @type {import('next').NextConfig} */

const withTelefunc = require("telefunc/next").default;
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  ...withTelefunc(),
};
console.log(nextConfig);
module.exports = nextConfig;
