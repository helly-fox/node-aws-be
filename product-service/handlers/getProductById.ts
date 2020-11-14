import { APIGatewayProxyHandler } from 'aws-lambda';
import { Client } from 'pg';
import 'source-map-support/register';
import { getErrorResponse, HEADERS, STATUSES, DB_OPTIONS } from '../helpers';

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
 *          schema:
 *              $ref: "#/definitions/Error"
 *       503:
 *          description: Internal server error
 *          schema:
 *              $ref: "#/definitions/Error"
 */

export const getProductById: APIGatewayProxyHandler = async (event, _context) => {
    console.log('GET Product with id: ',  event.pathParameters.product);
    const client = new Client(DB_OPTIONS);

    try {
        const productId = event.pathParameters.product;

        await client.connect();

        const { rows: result } = await client.query(`
            select
                id,
                title,
                description,
                image,
                price,
                count
            from
                products
            left join stocks
                on id = product_id
            where id = '${productId}'
            limit 1;
        `);

        if (!result.length) {
            return getErrorResponse(STATUSES.NOT_FOUND, `Product with id: ${productId} not found`);
        }
        return {
            statusCode: STATUSES.SUCCESS,
            headers: HEADERS,
            body: JSON.stringify(result[0], null, 2),
        };
    } catch (e) {
        return getErrorResponse(STATUSES.SERVER_ERROR, 'Server error')
    } finally {
        client.end();
    }
}
