module.exports = {
  siteUrl: "https://seniru.dev",
  generateRobotsTxt: true, // Generate robots.txt file
  exclude: ['/admin', '/admin/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/*'],
      },
    ],
  },
};
