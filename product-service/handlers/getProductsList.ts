import {APIGatewayProxyHandler} from 'aws-lambda';
import productList from '../mocks/products.json';
import { getErrorResponse, HEADERS, STATUSES } from '../helpers';
import 'source-map-support/register';

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
 *   Error:
 *     required:
 *       - status
 *       - message
 *     properties:
 *       status:
 *         type: number
 *       message:
 *         type: string
 */

/**
 * @swagger
 * /products:
 *   get:
 *     description: Returns list of products
 *     tags:
 *      - Product
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: returns array of products
 *         schema:
 *           type: "array"
 *           items:
 *              $ref: "#/definitions/Product"
 *       404:
 *          description: not found
 *          schema:
 *              $ref: "#/definitions/Error"
 */
export const getProductsList: APIGatewayProxyHandler = async () => {
    if (productList) {
        return {
            statusCode: STATUSES.SUCCESS,
            headers: HEADERS,
            body: JSON.stringify(productList, null, 2),
        };
    }

    return getErrorResponse(STATUSES.NOT_FOUND, 'product list not found');
}
