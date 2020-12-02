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
  plugins: ['serverless-webpack', 'serverless-dotenv-plugin'],
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
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: [{
          'Fn::GetAtt': [ 'SQSQueue', 'Arn' ]
        }]
      }
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      SQS_QUEUE: {
        Ref: 'SQSQueue'
      }
    },
  },
  resources: {
    Resources: {
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue'
        }
      },
      GatewayResponseAccessDenied: {
        Type: "AWS::ApiGateway::GatewayResponse",
        Properties: {
          ResponseParameters: {
            "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
            "gatewayresponse.header.Access-Control-Allow-Headers": "'*'"
          },
          ResponseType: 'ACCESS_DENIED',
          RestApiId: {
            Ref: "ApiGatewayRestApi"
          },
        }
      },
      GatewayResponseUnauthorized: {
        Type: "AWS::ApiGateway::GatewayResponse",
        Properties: {
          ResponseParameters: {
            "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
            "gatewayresponse.header.Access-Control-Allow-Headers": "'*'"
          },
          ResponseType: 'UNAUTHORIZED',
          RestApiId: {
            Ref: "ApiGatewayRestApi"
          },
        }
      },
    },
    Outputs: {
      SQSQueue: {
        Value: {
          Ref: "SQSQueue",
        },
        Export: {
          Name: "SQSQueue",
        },
      },
      SQSQueueUrl: {
        Value: {
          Ref: "SQSQueue",
        },
        Export: {
          Name: "SQSQueueUrl",
        },
      },
      SQSQueueArn: {
        Value: {
          "Fn::GetAtt": ["SQSQueue", "Arn"],
        },
        Export: {
          Name: "SQSQueueArn",
        },
      },
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
            authorizer: {
              name: 'basicAuthorizer',
              arn: 'arn:aws:lambda:eu-west-1:782744160328:function:authrization-service-dev-basicAuthorizer',
              type: 'token',
              resultTtlInSeconds: 0,
            },
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
