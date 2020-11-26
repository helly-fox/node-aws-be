// import {getProductById} from '../handlers/getProductById';
// import {getProductsList} from '../handlers/getProductsList';
// jest.mock('../mocks/products.json');
import * as AWSMock from 'aws-sdk-mock';
import {catalogBatchProcess} from '../handlers/catalogBatchProcess';
import {Client} from 'pg';

jest.mock('pg', () => {
  const mClient = {
    connect: jest.fn(),
    query: jest.fn(() => ({
      rows: [
        {
          id: '1',
        },
      ], rowCount: 1
    })),
    end: jest.fn(),
  };
  return {Client: jest.fn(() => mClient)};
});


describe('Product service', () => {
  // describe('getProductById', () => {
  //   test('Happy path', async () => {
  //     const rersponse = await getProductById({pathParameters: {product: '17'}});
  //
  //     expect(rersponse).toEqual({
  //       body: "{\n  \"count\": 4,\n  \"description\": \" The Classic Blue Spruce branches tips and shape echo the nuanced color variations and shape of the Colorado Blue Spruce. Its light gray, blue-green, and moss green needles are complemented by sturdy branches in a brown hue.\",\n  \"id\": \"17\",\n  \"price\": 199,\n  \"image\": \"https://images-na.ssl-images-amazon.com/images/I/91wWMMIPt-L._AC_SX522_.jpg\",\n  \"title\": \"6.5' Balsam Hill Blue Spruce Artificial Christmas Tree Unlit\"\n}",
  //       headers: {
  //         'Access-Control-Allow-Headers': 'Content-Type',
  //         'Access-Control-Allow-Methods': 'OPTIONS,GET',
  //         'Access-Control-Allow-Origin': '*'
  //       },
  //       statusCode: 200
  //     })
  //   });
  //
  //   test('Not found product', async () => {
  //     const rersponse = await getProductById({pathParameters: {product: '1'}});
  //
  //     expect(rersponse).toEqual({
  //       body: "{\n  \"message\": \"Product with id: 1 not found\",\n  \"status\": 404\n}",
  //       headers: {
  //         'Access-Control-Allow-Headers': 'Content-Type',
  //         'Access-Control-Allow-Methods': 'OPTIONS,GET',
  //         'Access-Control-Allow-Origin': '*'
  //       },
  //       statusCode: 404
  //     })
  //   });
  //
  //   test('Internal server error', async () => {
  //     const rersponse = await getProductById({product: '1'});
  //
  //     expect(rersponse).toEqual({
  //       body: "{\n  \"message\": \"Internal server error\",\n  \"status\": 503\n}",
  //       headers: {
  //         'Access-Control-Allow-Headers': 'Content-Type',
  //         'Access-Control-Allow-Methods': 'OPTIONS,GET',
  //         'Access-Control-Allow-Origin': '*'
  //       },
  //       statusCode: 503
  //     })
  //   });
  // });
  //
  // describe('getProductsList', () => {
  //   test('Happy path', async () => {
  //     const rersponse = await getProductsList();
  //
  //     expect(rersponse).toEqual({
  //       body: "[\n  {\n    \"count\": 4,\n    \"description\": \" The Classic Blue Spruce branches tips and shape echo the nuanced color variations and shape of the Colorado Blue Spruce. Its light gray, blue-green, and moss green needles are complemented by sturdy branches in a brown hue.\",\n    \"id\": \"17\",\n    \"price\": 199,\n    \"image\": \"https://images-na.ssl-images-amazon.com/images/I/91wWMMIPt-L._AC_SX522_.jpg\",\n    \"title\": \"6.5' Balsam Hill Blue Spruce Artificial Christmas Tree Unlit\"\n  }\n]",
  //       headers: {
  //         'Access-Control-Allow-Headers': 'Content-Type',
  //         'Access-Control-Allow-Methods': 'OPTIONS,GET',
  //         'Access-Control-Allow-Origin': '*'
  //       },
  //       statusCode: 200
  //     })
  //   });
  // });

  describe('catalogBatchProcess', () => {
    let consoleLogMock;
    beforeEach(() => {
      consoleLogMock = jest.spyOn(console, 'log');
      process.env.SNS_ARN = 'test';
    });

    afterEach(() => {
      jest.clearAllMocks();
      process.env.SNS_ARN = undefined;
    })

    it('should successfully add all products', async () => {
      const client = new Client();
      const snsMockPublish = jest.fn(() => Promise.resolve());
      AWSMock.mock('SNS', 'publish', snsMockPublish);
      const result = await catalogBatchProcess({
        Records: [{
          body: JSON.stringify(
            {
              title: 'Jersey Fraser Fir - 7.5 ft',
              description: 'This tree uses our trademarked "FEEL REAL" technology that offers outstanding realism on 3,144 branch tips. These crush-resistant tips give our trees and greenery foliage that best mirrors nature design.',
              image: 'https://images-na.ssl-images-amazon.com/images/I/91aH4GQzu1L._AC_SX679_.jpg',
              price: '500',
              count: '6',
            }
          )
        }]
      });
      expect(client.connect).toBeCalledTimes(1);
      expect(client.query).toBeCalledTimes(4);
      expect(client.query.mock.calls[0][0]).toEqual('BEGIN');
      expect(client.query.mock.calls[3][0]).toEqual('COMMIT');
      expect(consoleLogMock.mock.calls[0][0]).toEqual('Email was send');
      expect(snsMockPublish.mock.calls[0][0]).toEqual({
        Subject: 'New product with id 1 was added',
        Message: JSON.stringify(
          {
            title: 'Jersey Fraser Fir - 7.5 ft',
            description: 'This tree uses our trademarked "FEEL REAL" technology that offers outstanding realism on 3,144 branch tips. These crush-resistant tips give our trees and greenery foliage that best mirrors nature design.',
            image: 'https://images-na.ssl-images-amazon.com/images/I/91aH4GQzu1L._AC_SX679_.jpg',
            price: '500',
            count: '6',
          }
        ),
        MessageAttributes: {
          count: {
            DataType: "Number",
            StringValue: "6"
          }
        },
        TopicArn: 'test'
      })
      expect(consoleLogMock.mock.calls[1][0]).toEqual('Request ended');
      expect(client.end).toBeCalledTimes(1);
    });

    it('should fail due to parsing', async () => {
      const client = new Client();
      await catalogBatchProcess();
      expect(consoleLogMock).toBeCalledTimes(1);
      expect(client.query).toBeCalledWith('ROLLBACK');
    });

    it('should fail due to validation', async () => {
      const client = new Client();
      const result = await catalogBatchProcess({Records: [{body: ''}]});
      expect(client.end).toBeCalledTimes(1);
      expect(consoleLogMock).toBeCalledTimes(1);
      expect(client.query).toBeCalledWith('ROLLBACK');
    });
  });
});


