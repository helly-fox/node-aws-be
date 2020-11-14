import { APIGatewayProxyHandler } from 'aws-lambda';
import { Client } from 'pg';
import { getErrorResponse, HEADERS, STATUSES, DB_OPTIONS } from '../helpers';
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
 *       -count
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
 *       500:
 *          description: server error
 *          schema:
 *              $ref: "#/definitions/Error"
 */

export const getProductsList: APIGatewayProxyHandler = async () => {
    console.log('GET products');
    const client = new Client(DB_OPTIONS);

    try {
        await client.connect();

        const {rows: productList} = await client.query(`
            SELECT
                id,
                title,
                description,
                image,
                price,
                count
            FROM
                products
            LEFT JOIN stocks
                ON id = product_id;
        `);

        return {
            statusCode: STATUSES.SUCCESS,
            headers: HEADERS,
            body: JSON.stringify(productList, null, 2),
        };
    } catch (e) {
        return getErrorResponse(STATUSES.SERVER_ERROR, 'Server error')
    } finally {
        client.end();
    }
}
