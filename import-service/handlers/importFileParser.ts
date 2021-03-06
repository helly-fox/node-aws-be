import {S3, SQS} from 'aws-sdk';
import csv from 'csv-parser';
import 'source-map-support/register';

export const importFileParser = event => {
    try {
        const s3 = new S3({region: process.env.REGION});
        const sqs = new SQS();

        event.Records.forEach(r =>
            s3.getObject({
                Bucket: process.env.BUCKET,
                Key: r.s3.object.key
            }).createReadStream()
                .pipe(csv())
                .on('data', product => {
                    console.log(product);
                    sqs.sendMessage({
                        QueueUrl: process.env.SQS_QUEUE,
                        MessageBody: JSON.stringify(product)
                    }, err => {
                        console.log(err || 'Message was pushed to SQS')
                    })
                })
                .on('end', async () => {
                    try {
                        await s3.copyObject({
                            Bucket: process.env.BUCKET,
                            CopySource: `${process.env.BUCKET}/${r.s3.object.key}`,
                            Key: r.s3.object.key.replace('uploaded', 'parsed')
                        }).promise();
                        await s3.deleteObject({
                            Bucket: process.env.BUCKET,
                            Key: r.s3.object.key
                        }).promise();
                    } catch (e) {
                        console.log('ERROR', e);
                    }
                })
        )
    } catch (ex) {
        console.log('importFileParser', ex);
    }
}
