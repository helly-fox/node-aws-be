export enum STATUSES {
    SUCCESS = 200,
    NOT_FOUND = 404,
    SERVER_ERROR = 503
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
