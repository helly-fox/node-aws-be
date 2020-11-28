import {Client} from 'pg';
import {SNS} from 'aws-sdk';
import 'source-map-support/register';
import {DB_OPTIONS, schema} from '../helpers';

export const catalogBatchProcess = async (event) => {
    const sns = new SNS({region: process.env.REGION});
    const client = new Client(DB_OPTIONS);
    await client.connect();

    try {
        const products = event.Records.map(({body}) => {
            const product = JSON.parse(body);
            const {error} = schema.validate(product);
            return {...product, error};
        }).filter(p => {
            if (p.error) {
                console.log(`Product was skipped aa is not valid: ${JSON.parse(p)}`)
            }

            return !p.error;
        });

        if (!products.length) {
            throw new Error('no valid products to add');
        }

        await client.query('BEGIN');

        const {rows} = await client.query(`
            insert into products (title, description, price, image) values
            ${products.map(product => `('${product.title}', '${product.description}', ${product.price}, '${product.image}')`).join(',')}
            returning id;
        `);

        await client.query(`
            insert into stocks (product_id, count) values
            ${rows.map((r, index) => `('${r.id}', ${products[index].count})`).join(', ')};
        `);
        await client.query('COMMIT');

        await Promise.all(products.map((product, index) => sns.publish({
            Subject: `New product with id ${rows[index].id} was added`,
            Message: JSON.stringify(product),
            MessageAttributes: {
                count: {
                    DataType: 'Number',
                    StringValue: product.count
                },
            },
            TopicArn: process.env.SNS_ARN,
        }).promise()
            .then(() => console.log('Email was send', JSON.stringify(product)))
            .catch(e => {
                throw new Error(e)
            })));

        console.log('Request ended');
    } catch (e) {
        await client.query('ROLLBACK');
        console.log(e);
    } finally {
        client.end();
    }
}
