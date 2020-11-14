import {APIGatewayProxyHandler} from 'aws-lambda';
import {Client} from 'pg';
import 'source-map-support/register';
import {getErrorResponse, HEADERS, STATUSES, DB_OPTIONS, schema} from '../helpers';

/**
 * @swagger
 * definitions:
 *   Product:
 *     required:
 *       - id
 *       - image
 *       - title
 *       - price
 *       - count
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
 *   post:
 *     description: Creates new product
 *     tags:
 *      - Product
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: returns the product
 *       400:
 *          description: Product data is invalid
 *       500:
 *          description: server error
 *          schema:
 *              $ref: "#/definitions/Error"
 */

export const postNewProduct: APIGatewayProxyHandler = async (event, _context) => {
    console.log('POST product:', event.body);
    const client = new Client(DB_OPTIONS);

    try {
        const product =  JSON.parse(event.body);
        const { error } = await schema.validate(product);
        if (error) {
            return getErrorResponse(STATUSES.INVALID_INPUT, error.details);
        }

        await client.connect();
        await client.query('BEGIN');
        const {rows} = await client.query(`
            insert into products (title, description, price, image) values
            ('${product.title}', '${product.description}', ${product.price}, '${product.image}')
            returning id;
        `);
        await client.query(`
            insert into stocks (product_id, count) values
            ('${rows[0].id}', ${product.count});
        `);
        await client.query('COMMIT');

        return {
            statusCode: STATUSES.SUCCESS,
            headers: HEADERS,
            body: JSON.stringify({...product, id: rows[0].id}, null, 2),
        };
    } catch (e) {
        await client.query('ROLLBACK');
        return getErrorResponse(STATUSES.SERVER_ERROR, 'Server error')
    } finally {
        client.end();
    }
}
