import { GraphQLError } from 'graphql';
import config from '../../../config.js';
import fs from 'fs';

const uploadResumeFile = async (parent, { file }) => {
    const { createReadStream, fileName, mimeyype, encoding } = await file;

    const stream = createReadStream();
    const pathName = './' + fileName;

    try {
        await stream.pipe(fs.createWriteStream(pathName));
        return {
            status: 200,
            message: 'File uploaded successfully'
        };
    } catch (err) {
        throw new GraphQLError(err.message);
    }
};

export default { uploadResumeFile };
