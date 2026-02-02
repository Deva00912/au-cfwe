import React from "react";
import RenderImage from "../components/RenderImage";
import ImageCarousel from "../components/ImageCarousel";
import SectionCard from "../components/SectionCard";

export default function Facilities() {
  const carouselImages = [
    {
      id: 1,
      src: "https://www.annauniv.edu/WomenEmpCentre/images/fancydresscompetition.jpg",
      alt: "Fancy Dress competition held on 21.1.2023",
      title: "Fancy Dress competition held on 21.1.2023",
      showTitle: true,
    },
    {
      id: 2,
      src: "https://www.annauniv.edu/WomenEmpCentre/images/firecompetition.jpg",
      alt: "Cooking without fire competition held on 21.1.2023",
      title: "Cooking without fire competition held on 21.1.2023",
      showTitle: true,
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=500",
      alt: "Graduation ceremony",
    },
  ];

  const aims = [
    "Our aim is to provide outstanding quality day care service within the Anna University campus which meets all standards and expectations of the parents (Staff) and the University.",
    "To ensure that all the parents have complete access to appropriate childcare information.",
    "To enable parents to perform their activities in the University hassle free without any worries or second thoughts.",
  ];

  const sections = [
    {
      title: "Introduction",
      content: (
        <>
          <p className="text-gray-700 leading-relaxed mb-4 text-justify">
            Welcome to the Day Care Centre, Anna University.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4 text-justify">
            The University is proud to offer a comprehensive range of quality
            day care service to the children of staff of Anna University at
            affordable prices.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4 text-justify">
            This brochure is designed to provide initial information so that
            parents are aware that the children care and support exists.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4 text-justify">
            <b>Day Care Centres</b> in Main campus and MIT Campus are
            functioning under the auspices of Centre for Empowerment of Women,
            Anna University.
          </p>
          <p className="text-gray-700 leading-relaxed text-justify">
            Day Care Centres have been established at both the Main Campus
            (2002) and MIT Campus (2009) utilizing grants from UGC, New Delhi.
            The Day Care Centres (DCC) provide safe care of children of the
            employees and research scholars of Anna University. The DCC has
            women care takers to ensure peaceful and safe stay of children in
            the age group of 2 – 13 years on full day, half-a-day and
            after-school basis, as availed by the parents. Both the DCC are
            equipped with air-conditioners, cots, indoor and outdoor play
            materials and a library stocked with children's books. The children
            are engaged in activities like playing, reading and painting in the
            Centre. The Centres also periodically conduct competitions and games
            for the children availing Day Care.
          </p>
        </>
      ),
    },
    {
      title: "Establishment of new premises for Day Care Centre, Main campus",
      content: (
        <>
          <p className="text-gray-700 leading-relaxed mb-4 text-justify">
            A new building has been constructed for the functioning of Day Care
            Centre, main campus. The new building was inaugurated by our
            Vice-Chancellor on 1.9.2021. The Centre has started functioning in
            the new premises from the month of September 2021.
          </p>
          <RenderImage
            src="https://www.annauniv.edu/WomenEmpCentre/images/daycare.jpg"
            alt="CEW-inaugurated-2021-image"
            className="mx-auto my-6 rounded-lg shadow-md max-w-2xl w-full"
          />
        </>
      ),
    },
    {
      title: "Working Hours",
      content: (
        <>
          <p className="text-gray-700 leading-relaxed mb-4">
            <b>From 8.45 am to 5.45 pm</b>
          </p>
          <p className="text-gray-700 leading-relaxed text-justify">
            The Day Care Centre can be availed by the faculty members,
            non-teaching staff (Regular and Temporary staff), Students
            (UG/PG/Ph. D).
          </p>
        </>
      ),
    },
    {
      title: "Age group for admission",
      content: (
        <>
          <p className="text-gray-700 leading-relaxed mb-4 text-justify">
            <b>Upto 13 years of age.</b>
          </p>
          <p className="text-gray-700 leading-relaxed text-justify">
            There are at present about 12 children in the Day Care Centre, Main
            campus and about 10 children in MIT Campus.
          </p>
        </>
      ),
    },
    {
      title: "Aim",
      content: (
        <ul className="space-y-3">
          {aims.map((aim, index) => (
            <li key={index} className="flex items-start">
              <span className="flex-shrink-0 w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3"></span>
              <span className="text-gray-700 leading-relaxed text-justify">
                {aim}
              </span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Activities",
      content: (
        <>
          <p className="text-gray-700 leading-relaxed mb-4 text-justify">
            The Day Care Centre conducts various activities for the children for
            making the stay at the Centre pleasant and rewarding. Annual Drawing
            and Fancy Dress Competition is held and prizes are distributed to
            the children during Republic Day function by Honourable Vice
            Chancellor.
          </p>
          <p className="text-gray-700 leading-relaxed text-justify">
            Arts and Crafts classes, fabric painting are organized as a part of
            the Summer Camp.
          </p>
        </>
      ),
    },
    {
      title: "Library",
      content: (
        <p className="text-gray-700 leading-relaxed text-justify">
          Children's Library is well equipped with children's books.
        </p>
      ),
    },
    {
      title: "Instructions to Parents",
      content: (
        <>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700 text-justify">
                  Milk, Juice, food etc for the children shall be provided by
                  the parents and will be left with day care centre staff. Milk
                  will be refrigerated and served to the children after heating.
                  Drinking water is provided. Clean secure and hygienic
                  environment is assured. Every day pick up of the child shall
                  be only by the parent.
                </p>
              </div>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            <b>Absence of children should be intimated.</b>
          </p>
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            DAY CARE CENTRE
          </h1>
          <p className="text-xl text-gray-600 font-semibold">
            ANNA UNIVERSITY CHENNAI – 600025
          </p>
          <div className="w-24 h-1 bg-indigo-600 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          {sections.map((section, index) => (
            <SectionCard
              key={index}
              title={section.title}
              content={section.content}
            />
          ))}

          {/* Fee Structure Section */}
          <section className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-indigo-100 flex items-center">
              <span className="w-3 h-3 bg-indigo-500 rounded-full mr-3"></span>
              Fee Structure
            </h2>
            <FeeStructureTable />
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 font-semibold mb-2">Note:</p>
              <p className="text-blue-700 text-justify">
                Parents shall pay the fees in advance on or before 5th of every
                month. Payment to be made only by Cheque or DD. No cash will be
                accepted.
              </p>
            </div>
          </section>

          {/* Gallery Section */}
          <section className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-indigo-100 flex items-center">
              <span className="w-3 h-3 bg-indigo-500 rounded-full mr-3"></span>
              Competitions
            </h2>
            <ImageCarousel carouselImages={carouselImages} />
          </section>
        </div>
      </div>
    </div>
  );
}

const FeeStructureTable = () => {
  const tableData = [
    {
      id: 1,
      type: "Full day Care (from 8.30 am to 5.30 pm)",
      fees: [
        { regular: "Rs. 3000/-", temporary: "Rs. 625/-" },
        { regular: "For children upto one year: Rs. 2500/-", temporary: "" },
        {
          regular: "For children of 1 and a half years: Rs. 2000/-",
          temporary: "",
        },
        {
          regular: "For children of 2 and 3 years: Rs. 1250/-",
          temporary: "Rs. 500/-",
        },
      ],
    },
    {
      id: 2,
      type: "Half day Care (from 12.00 pm to 5.00 pm)",
      fees: [{ regular: "Rs. 1000/-", temporary: "Rs. 375/-" }],
    },
    {
      id: 3,
      type: "3 hour care (from 2.45 pm to 5.45 pm)",
      fees: [{ regular: "Rs. 150/-", temporary: "Rs. 50/-" }],
    },
  ];

  const tableHeaders = [
    "S.No",
    "Type of Care",
    "Fee structure (for Regular staff and Faculty)",
    "Fee structure Temporary staff / Daily Wage / Students (UG/PG/Ph.D)",
  ];

  return (
    <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-indigo-600 to-purple-600">
          <tr>
            {tableHeaders.map((header) => (
              <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tableData.map((row, rowIndex) => (
            <React.Fragment key={row.id}>
              {row.fees.map((fee, feeIndex) => (
                <tr
                  key={`${row.id}-${feeIndex}`}
                  className={
                    rowIndex % 2 === 0
                      ? "bg-gray-50 hover:bg-gray-100"
                      : "bg-white hover:bg-gray-50"
                  }
                >
                  {feeIndex === 0 && (
                    <>
                      <td
                        rowSpan={row.fees.length}
                        className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center align-top border-r"
                      >
                        {row.id}
                      </td>
                      <td
                        rowSpan={row.fees.length}
                        className="px-6 py-4 text-sm text-gray-900 align-top border-r"
                      >
                        {row.type}
                      </td>
                    </>
                  )}
                  <td className="px-6 py-4 text-sm text-gray-800 border-r">
                    {fee.regular}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {fee.temporary || (
                      <span className="text-gray-400 italic">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
