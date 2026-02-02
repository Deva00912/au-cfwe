import React from "react";
import SectionCard from "../components/SectionCard";
import RenderImage from "../components/RenderImage";

const About = () => {
  const sections = [
    {
      title: "Preamble",
      paragraphs: [
        `The Centre for Empowerment of Women, Anna University was established
            in the year 2002. Dr.K.Hemalatha, Professor, Department of
            Mathematics, (Retd) is the Founder Director of the Centre. The
            Centre for Empowerment of Women has been conducting Programmes
            related to Women Empowerment. The Centre periodically conducts talks
            and interactive sessions on gender issues, women in Science and
            Technology, health awareness, legal rights of women, stress-free
            womanhood with the help of renowned personalities from relevant
            fields. This provides inspiration and motivation to the women staff
            and students. The centre is very keen on conducting gender
            sensitization programmes. These programmes are being organized for
            the first semester students of University Departments to ensure
            gender friendly environment in the campus and to inculcate attitude
            to value the opposite gender. Student convention programmes are
            being organized in coordination with eWIT – Empowering women in
            Information and Technology, Chennai, a non-profit NGO for the girl
            students of Computer science and Information technology of Anna
            University as well as affiliated Engineering Colleges of Anna
            University. The centre has also been undertaking community outreach
            programmes especially for the urban downtrodden women of Chennai by
            way of conducting computer training programmes and many public
            relation campaigns. State Level Women Empowerment Conference,
            Workshop & Exhibition has been conducted in August 2022 in
            coordination with Women Entrepreneurs Welfare Association, WEWA- TN.
            As part of the programme of International Women's day, the Centre
            conducts annual exhibitions, in coordination with the Tamilnadu
            Corporation for Development of Women Ltd, Chennai and Women
            Entrepreneurs Welfare Association, WEWA- TN. The exhibits are
            products made by Self Help Group women with the purpose of helping
            the SHG women market their products and also to generate income for
            them.`,
      ],
    },
    {
      title: "Mission",
      paragraphs: [
        `The Centre for Empowerment of Women, Anna University shall provide
            excellent platform to bring the women employees and students of the
            University together with women empowerment organizations, government
            agencies, policy makers, academicians and technologists to:`,
        `Facilitate empowerment of women from across all sections and enable
            them to sustain positive professional growth, physical fitness and
            mental health through knowledge sharing, training and mentoring.`,
        `Contribute to enhance all the seven quotients, namely, intelligence,
            emotional, experience, digital, adversity, creativity and vision Q's
            that will accelerate personal growth and produce positive impact on
            the institution and society.`,
        `Encourage women in STEM to progress
            through broader engagement with the society through technical
            projects, women-specific problem solving and knowledge
            dissemination.`,
        `Impart technical and entrepreneurial skills to
            students and women groups through awareness programs, skill
            training, opportunity to exhibit products and guidance by industry
            experts.`,
        `Provide safe and quality day care facility to take care of
            children of employees and research scholars.`,
      ],
    },
    {
      title: "Vision",
      paragraphs: [
        `The Centre for Empowerment of Women at Anna University shall strive
            towards providing opportunities and excellent ambience to improve
            the quality of life of women employees and students through transfer
            of knowledge, training and guidance in order to empower them
            economically, socially, culturally and psychologically and in turn
            to enable them to utilize their potential to the fullest towards
            self-growth and contribution to the Institution as well as the
            Nation.`,
      ],
    },
  ];

  const staffDetails = {
    director: [
      {
        designation: "Director, Centre for Empowerment of Women",
        name: "Dr.C.Valliyammai",
        image:
          "https://www.annauniv.edu/WomenEmpCentre/images/valliyammai_C_Director%20-%20CEW.jpg", // Add your image URL here
        contact: {
          contactNumber: "",
          officeTelephone: "044-2235 8590 / 8591",
          email: "directorcew@gmail.com",
        },
      },
    ],
    deputyDirector: [
      {
        designation:
          "Deputy Director, Centre for Empowerment of Women (MIT Campus) & Coordinator, Day Care Centre MIT Campus",
        name: "Dr.G.Anitha",
        image: "https://www.annauniv.edu/WomenEmpCentre/images/anitha.jpg", // Add your image URL here
        contact: {
          contactNumber: "",
          officeTelephone: " 044-2251 6060",
          email: "anitha_g@annauniv.edu",
        },
      },
    ],
    administrativeStaff: [
      {
        name: "Mrs.Latha V Gopal",
        place: "Centre for Empowerment of Women",
        designation: "Professional Assistant- II",
        image: "https://www.annauniv.edu/WomenEmpCentre/images/latha.jpg", // Add your image URL here
      },
      {
        name: "Mrs.R.Manjula",
        place: "Day Care Centre Main campus",
        designation: "Peon",
        image: "https://www.annauniv.edu/WomenEmpCentre/images/manjula.jpg", // Add your image URL here
      },
      {
        name: "Mrs.M.Sagunthala",
        place: "Day Care Centre Main campus",
        designation: "Peon",
        image: "https://www.annauniv.edu/WomenEmpCentre/images/sagunthala.jpg", // Add your image URL here
      },
      {
        name: "Mrs.A.Muthulakshmi",
        place: "Day Care Centre Main campus",
        designation: "Peon",
        image:
          "https://www.annauniv.edu/WomenEmpCentre/images/muthulakshmi.jpg", // Add your image URL here
      },
      {
        name: "Mrs.S.Sasileka",
        place: "Day Care Centre Main campus",
        designation: "Peon",
        image: "https://www.annauniv.edu/WomenEmpCentre/images/sasileka.jpg", // Add your image URL here
      },
    ],
  };

  // Staff Card Component
  const StaffCard = ({ staff, category }) => {
    const getCategoryStyles = () => {
      switch (category) {
        case "director":
          return "border-l-4 border-blue-500 bg-blue-50";
        case "deputyDirector":
          return "border-l-4 border-green-500 bg-green-50";
        case "administrativeStaff":
          return "border-l-4 border-purple-500 bg-purple-50";
        default:
          return "border-l-4 border-gray-500 bg-gray-50";
      }
    };

    const getCategoryTitle = () => {
      switch (category) {
        case "director":
          return "Director";
        case "deputyDirector":
          return "Deputy Director";
        case "administrativeStaff":
          return "Administrative Staff";
        default:
          return "Staff";
      }
    };

    return (
      <div
        className={`p-6 rounded-lg shadow-md ${getCategoryStyles()} hover:shadow-lg transition-shadow duration-300 h-full flex flex-col`}
      >
        <div className="mb-4">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-gray-600 rounded-full">
            {getCategoryTitle()}
          </span>
        </div>

        {/* Staff Image - Larger Size */}
        <div className="flex flex-col items-center gap-4 mb-4">
          <div className="flex-shrink-0">
            <RenderImage
              src={staff.image}
              alt={staff.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              onError={(e) => {
                e.target.src = "/images/staff/placeholder.jpg"; // Fallback image
              }}
            />
          </div>
          <div className="flex-1 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {staff.name}
            </h3>
            <p className="text-gray-600 text-sm mb-1">{staff.designation}</p>
            <p className="text-gray-500 text-xs">{staff.place}</p>
          </div>
        </div>

        {/* Contact Information */}
        {staff.contact && (
          <div className="mt-auto pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Contact Information:
            </h4>
            {staff.contact.officeTelephone && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Office:</span>{" "}
                {staff.contact.officeTelephone}
              </p>
            )}
            {staff.contact.contactNumber && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Contact:</span>{" "}
                {staff.contact.contactNumber}
              </p>
            )}
            {staff.contact.email && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Email:</span>{" "}
                {staff.contact.email}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mission, Vision, Preamble Sections */}
        {sections.map((section, index) => (
          <div key={index} className="mb-12 bg-white rounded-lg shadow-sm">
            <SectionCard
              key={index}
              title={section.title}
              content={
                <div className="text-gray-600 leading-relaxed">
                  {section.paragraphs.map((paragraph, pIndex) => (
                    <p className="mb-4" key={pIndex}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              }
            />
          </div>
        ))}

        {/* Staff Details Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 pb-2 border-b-2 border-indigo-100 flex items-center">
            <span className="w-3 h-3 bg-indigo-500 rounded-full mr-3" />
            Faculties and Staff Details
          </h2>

          {/* Director Section */}
          {staffDetails.director.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                Director
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {staffDetails.director.map((staff, index) => (
                  <StaffCard key={index} staff={staff} category="director" />
                ))}
              </div>
            </div>
          )}

          {/* Deputy Director Section */}
          {staffDetails.deputyDirector.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                Deputy Director
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {staffDetails.deputyDirector.map((staff, index) => (
                  <StaffCard
                    key={index}
                    staff={staff}
                    category="deputyDirector"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Administrative Staff Section */}
          {staffDetails.administrativeStaff.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                Administrative Staff
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staffDetails.administrativeStaff.map((staff, index) => (
                  <StaffCard
                    key={index}
                    staff={staff}
                    category="administrativeStaff"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default About;
