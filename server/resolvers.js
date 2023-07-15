import {getJob, getJobs, getJobsByCompany} from "./db/jobs.js";
import {getCompany} from "./db/companies.js";
import {GraphQLError} from "graphql/error/index.js";

export const resolvers = {
    Query: {
        jobs: () => getJobs(),
        job: async (_root, {id}) => {
            const job = await getJob(id);
            if (!job){
                throw notFoundError('No job found with ID: ' + id);
            }
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