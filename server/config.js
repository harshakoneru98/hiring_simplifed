import dotenv from 'dotenv';
dotenv.config();

const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
const AWS_REGION = process.env.AWS_REGION;
const DATABASE_NAME = process.env.DATABASE_NAME;
const EMAIL_INDEX = process.env.EMAIL_INDEX;
const AUTH_KEY = process.env.AUTH_KEY;
const RESUME_BUCKET = process.env.RESUME_BUCKET;
const PYTHON_PATH = process.env.PYTHON_PATH;
const SERVER_URL = process.env.SERVER_URL;
const NEO4J_USER = process.env.NEO4J_USER;
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD;
const NEO4J_URI = process.env.NEO4J_URI;

export default {
    AWS_ACCESS_KEY,
    AWS_SECRET_KEY,
    AWS_REGION,
    DATABASE_NAME,
    EMAIL_INDEX,
    AUTH_KEY,
    RESUME_BUCKET,
    PYTHON_PATH,
    SERVER_URL,
    NEO4J_USER,
    NEO4J_PASSWORD,
    NEO4J_URI
};
