import React from "react";

interface AboutTabProps {
  about: string;
}

const AboutTab: React.FC<AboutTabProps> = ({ about }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold">About Us</h2>
      <p>{about}</p>
    </div>
  );
};

export default AboutTab;
