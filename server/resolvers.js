import {createJob, getJob, getJobs, getJobsByCompany} from "./db/jobs.js";
import {getCompany} from "./db/companies.js";
import {GraphQLError} from "graphql/error/index.js";

export const resolvers = {
    Query: {
        jobs: () => getJobs(),
        job: async (_root, {id}) => {
            const job = await getJob(id);
            if (!job) {
                throw notFoundError('No job found with ID: ' + id);
            }
            return job;
        },
        company: async (_root, {id}) => {
            const company = await getCompany(id);
            if (!company) {
                throw notFoundError('No company found with ID: ' + id);
            }
            return company;
        },
    },
    Company: {
        jobs: (company) => getJobsByCompany(company.id),
    },
    Job: {
        date: (job) => toIsoDate(job.createdAt),
        company: (job) => getCompany(job.companyId)
    },
    Mutation: {
        createJob: (_root, {input: {title, description}}) => {
            const companyId = 'FjcJCHJALA4i';
            return createJob({companyId, title, description});
        },
    },
};

function toIsoDate(value) {
    return value.slice(0, 'yyyy-mm-dd'.length);
}

function notFoundError(message){
    return new GraphQLError(message, {
        extensions: {
            code: 'NOT_FOUND',
        }
    });
}