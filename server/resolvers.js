import {createJob, deleteJob, getJob, getJobs, getJobsByCompany, updateJob} from "./db/jobs.js";
import {getCompany} from "./db/companies.js";
import {GraphQLError} from "graphql/error/index.js";

export const resolvers = {
    Query: {
        jobs: (_root, {limit}) => getJobs(limit),
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
        company: (job, _args, {companyLoader}) => {
            return companyLoader.load(job.companyId)
        },
    },
    Mutation: {
        createJob: (_root, {input: {title, description}}, {user}) => {
            if (!user) {
                throw unauthorizedError('Missing authentication!');
            }
            return createJob({companyId: user.companyId, title, description});
        },
        deleteJob: async (_root, {id}, {user}) => {
            if (!user) {
                throw unauthorizedError('Missing authentication!');
            }
            const job = await deleteJob(id, user.companyId);
            if (!job) {
                throw notFoundError('No job found with ID: ' + id);
            }
            return job;
        },
        updateJob: async (_root, {input: {id, title, description}}, {user}) => {
            if (!user) {
                throw unauthorizedError('Missing authentication!');
            }
            const job = await updateJob({id, title, description, companyId: user.companyId});
            if (!job) {
                throw notFoundError('No job found with ID: ' + id);
            }
            return job;
        }
    },
};

function toIsoDate(value) {
    return value.slice(0, 'yyyy-mm-dd'.length);
}

function notFoundError(message) {
    return new GraphQLError(message, {
        extensions: {
            code: 'NOT_FOUND',
        }
    });
}

function unauthorizedError(message) {
    return new GraphQLError(message, {
        extensions: {
            code: 'UNAUTHORIZED',
        }
    });
}