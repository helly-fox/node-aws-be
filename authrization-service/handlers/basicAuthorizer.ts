import { APIGatewayTokenAuthorizerEvent } from 'aws-lambda';
import 'source-map-support/register';

const generatePolicy = (principalId, resource, effect) => ({
    principalId,
    policyDocument: {
        Version: '2012-10-17',
        Statement: [
            {
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource
            }
        ]
    }
});

export const basicAuthorizer = async (event: APIGatewayTokenAuthorizerEvent, _context, cb) => {
    console.log(event);

    if (event.type !== 'TOKEN')
        cb('Unauthorized');

    try {
        const [userName = null, password = null] = Buffer
            .from(event.authorizationToken.split(' ')?.[1] ?? '', 'base64')
            .toString('utf-8')
            .split(':');

        console.log('userName: ', userName);
        console.log('password: ', password);

        const effect = (process.env.TEST_USER === userName && process.env.TEST_PASSWORD === password) ?
            'Allow': 'Deny';
        const policy = generatePolicy(effect, event.methodArn, effect);

        cb(null, policy);
    } catch (e) {
        cb(`Unauthorized: ${e.message}`)
    }
}
