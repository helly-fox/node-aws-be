import {importProductsFile} from "../handlers/importProductsFile";
import * as AWSMock from 'aws-sdk-mock';
import {HEADERS, STATUSES} from "../helpers";

describe('Import service', () => {
  describe('importProductsFile', () => {
    it('should create signed URL and return it back', async () => {
      const testURL = 'testUrl';
      const getSignedUrlMock = jest
        .fn((operation, params, callback) => callback(null, testURL));
      AWSMock.mock('S3', 'getSignedUrl', getSignedUrlMock);
      const result = await importProductsFile({queryStringParameters: {name: 'products.cvs'}});

      expect(result).toEqual({
        statusCode: STATUSES.SUCCESS,
        headers: HEADERS,
        body: testURL,
      });
      expect(getSignedUrlMock.mock.calls[0][1]).toEqual({
        Bucket: process.env.BUCKET,
        Key: 'uploaded/products.cvs',
        Expires: 60,
        ContentType: 'text/csv'
      });
    });

    it('should fail', async () => {
      const result = await importProductsFile();

      expect(result).toEqual({
        statusCode: STATUSES.SERVER_ERROR,
        headers: HEADERS,
        body: "{\n  \"message\": \"Server Error\",\n  \"status\": 500\n}",
      });
    });
  });
});
