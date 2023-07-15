import {getJob, getJobs, getJobsByCompany} from "./db/jobs.js";
import {getCompany} from "./db/companies.js";

export const resolvers = {
    Query: {
        jobs: () => getJobs(),
        job: (_root, {id}) => getJob(id),
        company: (_root, {id}) => getCompany(id),
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