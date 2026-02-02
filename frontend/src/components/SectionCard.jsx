import React from "react";

export default function SectionCard(props) {
  return (
    <>
      <section
        key={props?.index}
        className="bg-white rounded-2xl shadow-sm p-8"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 border-b-2 border-indigo-100 flex items-center">
          <span className="w-3 h-3 bg-indigo-500 rounded-full mr-3" />
          {props?.title}
        </h2>
        <div className="text-justify">{props?.content}</div>
      </section>
    </>
  );
}
