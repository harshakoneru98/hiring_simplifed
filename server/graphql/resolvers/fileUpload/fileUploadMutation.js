import { GraphQLError } from 'graphql';
import config from '../../../config.js';
import fs from 'fs';

const uploadResumeFile = async (parent, { file }) => {
    const { createReadStream, filename, mimetype, encoding } = await file;

    const stream = createReadStream();
    const pathName = './' + filename;

    try {
        const out = await stream.pipe(fs.createWriteStream(pathName));
        stream.pipe(out);
        return {
            status: 200,
            message: 'File uploaded successfully'
        };
    } catch (err) {
        throw new GraphQLError(err.message);
    }
};

export default { uploadResumeFile };
