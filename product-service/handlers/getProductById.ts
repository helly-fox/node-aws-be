import {APIGatewayProxyHandler} from 'aws-lambda';
import productList from '../mocks/products.json';
import 'source-map-support/register';
import { getErrorResponse, HEADERS, STATUSES } from '../helpers';

/**
 * @swagger
 * definitions:
 *   Product:
 *     required:
 *       - id
 *       - image
 *       - title
 *       - price
 *     properties:
 *       id:
 *         type: string
 *       image:
 *         type: string
 *       title:
 *         type: string
 *       description:
 *          type: string
 *       price:
 *          type: number
 *       count:
 *          type: number
 */

/**
 * @swagger
 * /products/{product}:
 *   get:
 *     description: Returns product by ID
 *     parameters:
 *      - name: product
 *        required: true
 *        in: path
 *        description: ID of the product
 *        type: string
 *     tags:
 *      - Product
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: returns the product
 *       404:
 *          description: Product not found
 *       503:
 *          description: Internal server error
 */

export const getProductById: APIGatewayProxyHandler = async (event, _context) => {
    try {
        const productId = event.pathParameters.product;

        const product = productList.find(p => p.id === productId);

        if (!product) {
            return getErrorResponse(STATUSES.NOT_FOUND, `Product with id: ${productId} not found`);
        }
        return {
            statusCode: STATUSES.SUCCESS,
            headers: HEADERS,
            body: JSON.stringify(product, null, 2),
        };
    } catch (e) {
       return getErrorResponse(STATUSES.SERVER_ERROR, 'Internal server error')
    }
}
