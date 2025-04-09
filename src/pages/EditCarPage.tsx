
import React from "react";
import { useParams } from "react-router-dom";
import EditCarPageContent from "@/components/edit/EditCarPageContent";

const EditCarPage = () => {
  const { id } = useParams();
  
  if (!id) {
    return <div>Error: No car ID provided</div>;
  }
  
  return <EditCarPageContent carId={id} />;
};

export default EditCarPage;
