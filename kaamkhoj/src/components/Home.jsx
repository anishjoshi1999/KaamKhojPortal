import React from 'react';
import ButtonLink from './Reusable/ButtonLink';
function Home() {
  return (
    <div className="container py-5 text-center">
      <h1 className="mb-4">Welcome to KaamKhoj Portal</h1>
      <ButtonLink to="/jobs" label="Jobs" />
      {/* <ButtonLink to="/services" label="Services" /> */}
    </div>
  );
}

export default Home;
