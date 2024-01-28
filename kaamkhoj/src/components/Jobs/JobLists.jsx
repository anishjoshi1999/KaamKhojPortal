import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JobListItems from "../Reusable/JobListItems"

function JobLists() {
  const [jobsData, setJobsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://kaamkhoj.cyclic.app/api/jobs');
        console.log(response)
        setJobsData(response.data);
      } catch (error) {
        console.error('Error fetching data from the API:', error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container py-5">
      <h2 className="text-primary text-center">Jobs List</h2>
      <JobListItems jobsData={jobsData} />
    </div>
  );
}

export default JobLists;