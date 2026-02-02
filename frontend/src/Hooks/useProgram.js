// // Hooks/useProgram.js
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchProgramsStart,
//   addProgramStart,
//   deleteProgramStart,
//   updateProgramStart,
// } from "../store/slices/programsSlice";

// export const useProgram = () => {
//   const dispatch = useDispatch();
//   const {
//     items: programs,
//     loading,
//     error,
//   } = useSelector((state) => state.programs);

//   const getProgramsByYear = () => {
//     const years = {};
//     programs.forEach((program) => {
//       if (!years[program.year]) {
//         years[program.year] = [];
//       }
//       years[program.year].push(program);
//     });

//     return Object.keys(years)
//       .sort((a, b) => b - a)
//       .reduce((sorted, year) => {
//         sorted[year] = years[year].sort(
//           (a, b) => new Date(b.date) - new Date(a.date)
//         );
//         return sorted;
//       }, {});
//   };

//   return {
//     programs,
//     loading,
//     error,
//     fetchPrograms: () => dispatch(fetchProgramsStart()),
//     addProgram: (program) => dispatch(addProgramStart(program)),
//     deleteProgram: (id) => dispatch(deleteProgramStart(id)),
//     updateProgram: (id, updatedProgram) =>
//       dispatch(updateProgramStart({ id, ...updatedProgram })),
//     getProgramsByYear,
//   };
// };
