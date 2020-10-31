import { getProductById } from '../handlers/getProductById';
import { getProductsList } from '../handlers/getProductsList';
jest.mock('../mocks/products.json');

describe('Product service', () => {
  describe('getProductById', () => {
    test('Happy path', async () => {
      const rersponse = await getProductById({pathParameters: {product: '17'}});

      expect(rersponse).toEqual({
        body: "{\n  \"count\": 4,\n  \"description\": \" The Classic Blue Spruce branches tips and shape echo the nuanced color variations and shape of the Colorado Blue Spruce. Its light gray, blue-green, and moss green needles are complemented by sturdy branches in a brown hue.\",\n  \"id\": \"17\",\n  \"price\": 199,\n  \"image\": \"https://images-na.ssl-images-amazon.com/images/I/91wWMMIPt-L._AC_SX522_.jpg\",\n  \"title\": \"6.5' Balsam Hill Blue Spruce Artificial Christmas Tree Unlit\"\n}",
        headers: {
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'OPTIONS,GET',
          'Access-Control-Allow-Origin': '*'
        },
        statusCode: 200
      })
    });

    test('Not found product', async () => {
      const rersponse = await getProductById({pathParameters: {product: '1'}});

      expect(rersponse).toEqual({
        body: "{\n  \"message\": \"Product with id: 1 not found\",\n  \"status\": 404\n}",
        headers: {
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'OPTIONS,GET',
          'Access-Control-Allow-Origin': '*'
        },
        statusCode: 404
      })
    });

    test('Internal server error', async () => {
      const rersponse = await getProductById({product: '1'});

      expect(rersponse).toEqual({
        body: "{\n  \"message\": \"Internal server error\",\n  \"status\": 503\n}",
        headers: {
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'OPTIONS,GET',
          'Access-Control-Allow-Origin': '*'
        },
        statusCode: 503
      })
    });
  });

  describe('getProductsList', () => {
    test('Happy path', async () => {
      const rersponse = await getProductsList();

      expect(rersponse).toEqual({
        body: "[\n  {\n    \"count\": 4,\n    \"description\": \" The Classic Blue Spruce branches tips and shape echo the nuanced color variations and shape of the Colorado Blue Spruce. Its light gray, blue-green, and moss green needles are complemented by sturdy branches in a brown hue.\",\n    \"id\": \"17\",\n    \"price\": 199,\n    \"image\": \"https://images-na.ssl-images-amazon.com/images/I/91wWMMIPt-L._AC_SX522_.jpg\",\n    \"title\": \"6.5' Balsam Hill Blue Spruce Artificial Christmas Tree Unlit\"\n  }\n]",
        headers: {
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'OPTIONS,GET',
          'Access-Control-Allow-Origin': '*'
        },
        statusCode: 200
      })
    });
  });
});


