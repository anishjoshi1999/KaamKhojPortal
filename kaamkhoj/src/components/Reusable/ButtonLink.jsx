// A reusable job details table component
import React from 'react';
function ButtonLink({ to, label }) {
    return (
      <h2>
        <a href={to} className="btn btn-lg btn-primary">
          {label}
        </a>
      </h2>
    );
  }
  
  export default ButtonLink;