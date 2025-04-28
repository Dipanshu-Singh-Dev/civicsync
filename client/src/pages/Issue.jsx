import React from "react";
import { useParams } from "react-router-dom";

const Issue = () => {
  const { id } = useParams();
  return (
    <div>
      <h1>Issue Page</h1>
      <p>Issue ID: {id}</p>
    </div>
  );
};

export default Issue;
