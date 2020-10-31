module.exports = {
  info: {
    title: 'Product Service',
    version: '0.0.1',
    description: 'Product service for AWS NodeJS program',
  },
  // host,
  apis: ['./handlers/getProductsList.ts', './handlers/getProductById.ts'],
  host: 'i43qjd68m8.execute-api.eu-west-1.amazonaws.com',
  basePath: '/dev/', // Base path (optional)
};
