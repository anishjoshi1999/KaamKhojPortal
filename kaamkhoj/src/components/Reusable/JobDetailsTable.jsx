// A reusable job details table component
import React from 'react';
function JobDetailsTable({ jobData }) {
    return (
      <table className="table table-bordered table-hover">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Job Name</th>
            <th scope="col">Desired Salary</th>
            <th scope="col">Job Description</th>
            <th scope="col">Employer Name</th>
            <th scope="col">Contact Number</th>
            <th scope="col">Location</th>
            <th scope="col">Created Time</th>
          </tr>
        </thead>
        <tbody>
          {jobData.jobs.map((job) => (
            <tr key={job.jobName}>
              <td>{job.jobName}</td>
              <td>{job.salary}</td>
              <td>{job.description}</td>
              <td>{job.ownerName}</td>
              <td>{job.contactNumber}</td>
              <td>{job.location}</td>
              <td>{job.createdTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  export default JobDetailsTable;