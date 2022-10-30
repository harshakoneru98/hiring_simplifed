const dotenv = require('dotenv');
dotenv.config();

const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
const AWS_REGION = process.env.AWS_REGION;
const DATABASE_NAME = process.env.DATABASE_NAME;
const EMAIL_INDEX = process.env.EMAIL_INDEX;

module.exports = {
    AWS_ACCESS_KEY,
    AWS_SECRET_KEY,
    AWS_REGION,
    DATABASE_NAME,
    EMAIL_INDEX
};
