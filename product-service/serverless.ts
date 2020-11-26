import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'product-service',
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
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      PG_HOST: 'rs-aws-shop.ct0pkmud4qvd.eu-west-1.rds.amazonaws.com',
      PG_PORT: 5432,
      PG_DATABASE: 'rs_aws_shop_db',
      PG_USERNAME: 'user', // insert
      PG_PASSWORD: 'password', //insert
      SQS_QUEUE: {
        "Fn::ImportValue": 'SQSQueueUrl',
      },
      SNS_ARN: {
        Ref: 'SNSTopic'
      }
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: [{
          "Fn::ImportValue": 'SQSQueueArn',
        }]
      },
      {
        Effect: 'Allow',
        Action: 'sns:*',
        Resource: {
          Ref: 'SNSTopic'
        }
      }
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
    },
  },
  resources: {
    Resources: {
      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'createProductTopic'
        }
      },
      SNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'elena.proweb@gmail.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSTopic'
          }
        }
      },
      SNSBigAmountSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'helly.ursa.fox@gmail.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSTopic'
          },
          FilterPolicy: {
            count: [{numeric: [">=", 10]}]
          }
        }
      }
    }
  },
  functions: {
    getProductsList: {
      handler: 'handlers/getProductsList.getProductsList',
      events: [
        {
          http: {
            method: 'get',
            path: 'products',
            cors: true,
          }
        }
      ]
    },
    getProductById: {
      handler: 'handlers/getProductById.getProductById',
      events: [
        {
          http: {
            method: 'get',
            path: 'products/{product}',
            cors: true,
          }
        }
      ]
    },
    postNewProduct: {
      handler: 'handlers/postNewProduct.postNewProduct',
      events: [
        {
          http: {
            method: 'post',
            path: 'products',
            cors: true,
          }
        }
      ]
    },
    catalogBatchProcess: {
      handler: 'handlers/catalogBatchProcess.catalogBatchProcess',
      events: [
        {
          sqs: {
            batchSize: 5,
            arn: {
              "Fn::ImportValue": 'SQSQueueArn',
            }
          }
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration;
