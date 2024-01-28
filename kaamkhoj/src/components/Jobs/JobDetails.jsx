import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import JobDetailsTable from '../Reusable/JobDetailsTable'
function JobDetails() {
  const { value } = useParams();
  const [jobData, setJobData] = useState({ jobs: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/jobs');
        const temp = response.data.filter((element) => element.name === value);
        setJobData(temp[0]);
      } catch (error) {
        console.error('Error fetching data from the API:', error.message);
      }
    };

    fetchData();
  }, [value]);

  return (
    <div className="container py-5">
      <JobDetailsTable jobData={jobData} />
    </div>
  );
}

export default JobDetails;