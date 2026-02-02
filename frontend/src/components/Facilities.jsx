import React from "react";
import Button from "./Button";

const Facilities = () => {
  const facilities = [
    {
      title: "Day Care Centre",
      description:
        "offer a comprehensive range of quality day care service to the children of staff of Anna University and the students.",
    },
    {
      title: "Projects",
      description:
        "Dedicated counseling, placement services, workshops, and industry interaction programs for women.",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Facilities and Projects
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-justify">
            Centre for Empowerment of Women provides facilities for women
            empowerment and support. It conducts various projects aimed at
            enhancing the skills and opportunities for women in different
            fields.
          </p>
        </div>

        {/* Card section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((facility, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="p-6">
                <div className="text-4xl mb-4">{facility.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {facility.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-justify">
                  {facility.description}
                </p>
                <Button
                  text="Learn more"
                  className="mt-4 text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                  onClick={() =>
                    console.log(`Learn more about ${facility.title}`)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Facilities;
