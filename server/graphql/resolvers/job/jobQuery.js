import { GraphQLError } from 'graphql';
import neo4j from 'neo4j-driver';
import config from '../../../config.js';

const getJobData = async (parent, args) => {
    const { limit, offset } = args.input;

    const driver = neo4j.driver(
        config.NEO4J_URI,
        neo4j.auth.basic(config.NEO4J_USER, config.NEO4J_PASSWORD)
    );

    try {
        const session = driver.session({ database: 'neo4j' });

        const readQuery = `MATCH (job:Job) - [:Located_in_City] -> (city:City)
        MATCH (job) - [:Located_in_State] -> (state:State)
        MATCH (job) - [:Work_4_Company] -> (company:Company)
        MATCH (company) - [:type_of] -> (company_type:Comp_Type)
        MATCH (job) - [:has_job_family] -> (job_family:Job_Family)
        MATCH (job) - [:Requires_degree] -> (education:Education_Level)
        MATCH (job) - [:Requires_Skill] -> (skills:Skill)
        RETURN job.name as name, job.Title as title, job.H1B_flag as h1b, job.Salary as salary, job.Work_Min as min_work_exp, job.Work_Max as max_work_exp, job.job_url as job_url, job.JD as jd, city.name as city, state.name as state, company.name as company, company_type.name as company_type, job_family.name as job_family, COLLECT(DISTINCT(education.name)) as education, COLLECT(DISTINCT(skills.name)) as skills
        SKIP ${offset}
        LIMIT ${limit}`;

        const readResult = await session.executeRead((tx) => tx.run(readQuery));

        let final_result = [];

        readResult.records.forEach((record) => {
            final_result.push({
                name: record.get('name').toNumber(),
                title: record.get('title'),
                h1b: record.get('h1b').toNumber(),
                jd: record.get('jd'),
                salary: record.get('salary').toNumber(),
                job_url: record.get('job_url'),
                min_work_exp: record.get('min_work_exp').toNumber(),
                max_work_exp: record.get('max_work_exp').toNumber(),
                job_family: record.get('job_family'),
                city: record.get('city'),
                state: record.get('state'),
                company: record.get('company'),
                company_type: record.get('company_type'),
                education: record.get('education'),
                skills: record.get('skills')
            });
        });

        return final_result;
    } catch (error) {
        throw new GraphQLError(error.message);
    } finally {
        await driver.close();
    }
};

export default { getJobData };