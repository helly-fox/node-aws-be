import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'import-service',
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    region: 'eu-west-1',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:ListBucket',
        Resource: ['arn:aws:s3:::rs-school-aws-shop']
      },
      {
        Effect: 'Allow',
        Action: ['s3:*'],
        Resource: ['arn:aws:s3:::rs-school-aws-shop/*']
      },
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      BUCKET: 'rs-school-aws-shop',
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
  },
  functions: {
    importFileParser: {
      handler: 'handlers/importFileParser.importFileParser',
      events: [
        {
          s3: {
            bucket: 'rs-school-aws-shop',
            event: 's3:ObjectCreated:*',
            rules: [{ prefix: 'uploaded/' } as any],
            existing: true
          }
        }
      ]
    },
    importProductsFile: {
      handler: 'handlers/importProductsFile.importProductsFile',
      events: [
        {
          http: {
            method: 'put',
            path: 'import',
            cors: true,
            request: {
              parameters: {
                querystrings: {
                  name: true
                }
              }
            }
          }
        }
      ]
    },
  }
}

module.exports = serverlessConfiguration;
