import * as Joi from "joi";

export enum STATUSES {
    SUCCESS = 200,
    INVALID_INPUT = 400,
    NOT_FOUND = 404,
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

const {PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD} = process.env;

export const DB_OPTIONS = {
    host: PG_HOST,
    port: PG_PORT,
    database: PG_DATABASE,
    user: PG_USERNAME,
    password: PG_PASSWORD,
    ssl: {
        rejectUnauthorized: false // to avoid warring in this example
    },
    connectionTimeoutMillis: 5000 // time in millisecond for termination of the database query
};

export const schema = Joi.object({
    count: Joi.number().integer().positive().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().integer().positive().required(),
    image: Joi.string().required(),
});
