// A reusable job list items component
import React from 'react';
import { Link } from 'react-router-dom';
function JobListItems({ jobsData }) {
    return (
      <ol className="list-group list-group-numbered">
        {jobsData.map((element) => (
          <li key={element.name}>
            <Link to={`/jobs/${element.name}`}>
              {element.name}: {element.totalAvailableJobs}
            </Link>
          </li>
        ))}
      </ol>
    );
  }
  
  export default JobListItems;