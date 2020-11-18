export enum STATUSES {
    SUCCESS = 200,
    SERVER_ERROR = 500
};

export const HEADERS = {
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS,GET'
};

export const getErrorResponse = (status: STATUSES, errorMessage) => ({
    statusCode: status,
    headers: HEADERS,
    body: JSON.stringify({
        message: errorMessage,
        status
    }, null, 2),
});
