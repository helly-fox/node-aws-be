import {APIGatewayProxyHandler} from 'aws-lambda';
import { S3 } from 'aws-sdk';
import {getErrorResponse, HEADERS, STATUSES} from "../helpers";
import 'source-map-support/register';

export const importProductsFile: APIGatewayProxyHandler = async event => {
    try {
        const {name} = event.queryStringParameters;
        const path = `uploaded/${name}`;
        const s3 = new S3({region: process.env.REGION});
        const params = {
            Bucket: process.env.BUCKET,
            Key: path,
            Expires: 60,
            ContentType: 'text/csv'
        };

        return await new Promise((resolve, reject) => {
            s3.getSignedUrl('putObject', params, (err, url) => {
                if (err) {
                    reject(getErrorResponse(STATUSES.SERVER_ERROR, 'Server Error'));
                }

                return resolve({
                    statusCode: STATUSES.SUCCESS,
                    headers: HEADERS,
                    body: url,
                });
            });
        });
    } catch (ex) {
        console.log(ex);
        return getErrorResponse(STATUSES.SERVER_ERROR, 'Server Error');
    }
}
