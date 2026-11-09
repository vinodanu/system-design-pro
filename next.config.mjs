/** @type {import('next').NextConfig} */
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const isPages = process.env.GITHUB_PAGES === 'true';
// For project Pages: https://user.github.io/repo/. For user/org Pages, no prefix.
const basePath = isPages && repo && !repo.endsWith('.github.io') ? `/${repo}` : '';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  // /content MDX is compiled at build time by next-mdx-remote/rsc.
  // No @next/mdx loader is needed because /content is outside /app.
};
export default nextConfig;
