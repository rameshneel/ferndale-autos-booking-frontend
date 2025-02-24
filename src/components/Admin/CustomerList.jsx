import React, { useState, useEffect, useCallback } from "react";
import {
  useTable,
  usePagination,
  useSortBy,
  useGlobalFilter,
} from "react-table";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
  EllipsisHorizontalIcon,
  TrashIcon,
  ChevronDoubleLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import CustomerInfoModal from "./CustomerInfoModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { deleteCustomerById, getAllDataBooking } from "../../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Debounce helper function
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const queryParams = new URLSearchParams(location.search);
  const initialPage = parseInt(queryParams.get("page"), 10) || 1;
  const initialPageSize = parseInt(queryParams.get("pageSize"), 10) || 10;
  const [pageIndex, setPageIndex] = useState(initialPage - 1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchTerm = useDebounce(searchInput, 500);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllDataBooking(
        pageIndex,
        pageSize,
        debouncedSearchTerm
      );
      setCustomers(response.data.data.customers);
      setTotalPages(response.data.data.totalPages);
    } catch (err) {
      if (err.response?.data?.message === "Unauthorized request")
        navigate("/login");
      setError(err.response?.data?.message || "Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  }, [pageIndex, pageSize, debouncedSearchTerm, navigate]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  useEffect(() => {
    setPageIndex(0);
  }, [searchInput]);

  useEffect(() => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set("page", pageIndex + 1);
    newSearchParams.set("pageSize", pageSize);
    if (debouncedSearchTerm) newSearchParams.set("search", debouncedSearchTerm);
    else newSearchParams.delete("search");
    navigate(`${location.pathname}?${newSearchParams.toString()}`, {
      replace: true,
    });
  }, [pageIndex, pageSize, debouncedSearchTerm, location.pathname, navigate]);

  const columns = React.useMemo(
    () => [
      { Header: "Name", accessor: "customerName", sortType: "alphanumeric" },
      {
        Header: "Date",
        accessor: "selectedDate",
        sortType: "basic",
        Cell: ({ value }) => format(new Date(value), "dd/MM/yyyy"),
      },
      { Header: "Time Slot", accessor: "selectedTimeSlot", sortType: "basic" },
      {
        Header: "Total",
        accessor: "totalPrice",
        sortType: "basic",
        Cell: ({ value }) => `£${value}`,
      },
      {
        Header: "Payment Status",
        accessor: "paymentStatus",
        sortType: "basic",
        Cell: ({ value }) => (value ? value.toUpperCase() : "N/A"),
      },
      {
        Header: "Booked By",
        accessor: "bookedBy",
        sortType: "basic",
        Cell: ({ value }) => (value ? value.toUpperCase() : "N/A"),
      },
      {
        Header: "Payment",
        accessor: "paymentMethod",
        sortType: "basic",
        Cell: ({ value }) => (value ? value.toUpperCase() : "N/A"),
      },
      {
        Header: "Actions",
        accessor: "_id",
        disableSortBy: true,
        Cell: ({ row }) => (
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => {
                setSelectedCustomerId(row.original._id);
                setModalOpen(true);
              }}
              className="text-teal-400 hover:text-teal-300"
            >
              <EllipsisHorizontalIcon className="h-5 w-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => {
                setSelectedCustomerId(row.original._id);
                setDeleteModalOpen(true);
              }}
              className="text-red-400 hover:text-red-300"
            >
              <TrashIcon className="h-5 w-5" />
            </motion.button>
          </div>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize: setTablePageSize,
    state: { pageIndex: tablePageIndex, pageSize: tablePageSize },
  } = useTable(
    {
      columns,
      data: customers,
      initialState: { pageIndex, pageSize },
      manualPagination: true,
      pageCount: totalPages,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  useEffect(() => setPageIndex(tablePageIndex), [tablePageIndex]);
  useEffect(() => setPageSize(tablePageSize), [tablePageSize]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setSelectedCustomerId(null);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeleteModalOpen(false);
    setSelectedCustomerId(null);
  }, []);

  const deleteCustomer = async (id) => {
    try {
      const response = await deleteCustomerById(id);
      toast.success(
        response?.data?.message || "Customer deleted successfully!"
      );
      setCustomers(customers.filter((customer) => customer._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete customer.");
    }
  };

  return (
    <div className="flex flex-col p-6 bg-gray-900 min-h-screen font-sans text-gray-200">
      {/* Compact Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center mb-6 w-full max-w-md bg-gray-800 rounded-full shadow-md py-2 px-4"
      >
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-2" />
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search bookings..."
          className="w-full text-sm bg-transparent border-none focus:outline-none focus:ring-0 text-gray-200 placeholder-gray-500"
        />
      </motion.div>

      {/* Loading & Error States */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center py-8"
        >
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-teal-400"></div>
        </motion.div>
      )}
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-400 text-center mb-4 text-sm"
        >
          {error}
        </motion.p>
      )}

      {/* Table */}
      <div className="shadow-xl rounded-lg overflow-hidden bg-gray-800">
        <table
          {...getTableProps()}
          className="min-w-full divide-y divide-gray-700"
        >
          <thead className="bg-gray-700">
            {headerGroups.map((headerGroup, index) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider"
                    key={column.id}
                  >
                    <div className="flex items-center">
                      {column.render("Header")}
                      {column.canSort && (
                        <ChevronUpDownIcon className="ml-2 h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody
            {...getTableBodyProps()}
            className="bg-gray-800 divide-y divide-gray-700"
          >
            <AnimatePresence>
              {page.map((row, index) => {
                prepareRow(row);
                return (
                  <motion.tr
                    {...row.getRowProps()}
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-700"
                  >
                    {row.cells.map((cell, idx) => (
                      <td
                        {...cell.getCellProps()}
                        key={idx}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-200"
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-6 flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-md"
      >
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>
          </span>
          <select
            value={pageSize}
            onChange={(e) => setTablePageSize(Number(e.target.value))}
            className="p-1 bg-gray-700 border border-gray-600 rounded-lg text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            className="p-2 rounded-lg bg-teal-500 text-white disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            <ChevronDoubleLeftIcon className="h-5 w-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="p-2 rounded-lg bg-teal-500 text-white disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="p-2 rounded-lg bg-teal-500 text-white disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            className="p-2 rounded-lg bg-teal-500 text-white disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            <ChevronDoubleRightIcon className="h-5 w-5" />
          </motion.button>
        </div>
      </motion.div>

      {/* Modals */}
      <AnimatePresence>
        {modalOpen && (
          <CustomerInfoModal
            isOpen={modalOpen}
            onClose={closeModal}
            customerId={selectedCustomerId}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {deleteModalOpen && (
          <DeleteConfirmationModal
            isOpen={deleteModalOpen}
            onClose={closeDeleteModal}
            onConfirm={() => {
              deleteCustomer(selectedCustomerId);
              closeDeleteModal();
            }}
          />
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" // Matches the dark theme
      />
    </div>
  );
};

export default Booking;

// import React, { useState, useEffect, useCallback } from "react";
// import {
//   useTable,
//   usePagination,
//   useSortBy,
//   useGlobalFilter,
// } from "react-table";
// import { format } from "date-fns";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   ChevronUpDownIcon,
//   MagnifyingGlassCircleIcon,
//   EllipsisHorizontalIcon,
//   PencilSquareIcon,
//   PhotoIcon,
//   TrashIcon,
//   CameraIcon,
//   ReceiptRefundIcon,
// } from "@heroicons/react/24/outline";
// import {
//   ChevronDoubleLeftIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   ChevronDoubleRightIcon,
// } from "@heroicons/react/24/solid";
// import CustomerInfoModal from "./CustomerInfoModal";
// import DeleteConfirmationModal from "./DeleteConfirmationModal";
// import { deleteCustomerById, getAllDataBooking } from "../../services/api";
// import { useLocation, useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import PhotoGallery from "./PhotoGallery";
// import RefundModal from "./RefundModal";
// import UpdateBookingbyAdminForm from "./UpdateBookingbyAdminForm";
// // Debounce helper function
// const useDebounce = (value, delay) => {
//   const [debouncedValue, setDebouncedValue] = useState(value);

//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedValue(value);
//     }, delay);

//     return () => {
//       clearTimeout(handler);
//     };
//   }, [value, delay]);

//   return debouncedValue;
// };
// export default function Booking() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editModalOpen, setEditModalOpen] = useState(false); // State for edit modal
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [selectedCustomerId, setSelectedCustomerId] = useState(null);
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [totalPages, setTotalPages] = useState(0);
//   const queryParams = new URLSearchParams(location.search);
//   const initialPage = parseInt(queryParams.get("page"), 10) || 1;
//   const initialPageSize = parseInt(queryParams.get("pageSize"), 10) || 10;
//   const [pageIndex, setPageIndex] = useState(initialPage - 1);
//   const [pageSize, setPageSize] = useState(initialPageSize);
//   const [searchInput, setSearchInput] = useState("");
//   const debouncedSearchTerm = useDebounce(searchInput, 500);

//   const fetchCustomers = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await getAllDataBooking(
//         pageIndex,
//         pageSize,
//         debouncedSearchTerm
//       );
//       setCustomers(response.data.data.customers);
//       setTotalPages(response.data.data.totalPages);
//     } catch (err) {
//       if (err.response?.data?.message === "Unauthorized request") {
//         navigate("/login");
//       }
//       setError(err.response?.data?.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [pageIndex, pageSize, debouncedSearchTerm, navigate]);

//   // Effect for fetching data when search term changes
//   useEffect(() => {
//     fetchCustomers();
//   }, [fetchCustomers]);

//   useEffect(() => {
//     setPageIndex(0);
//   }, [searchInput]);

//   useEffect(() => {
//     const newSearchParams = new URLSearchParams(location.search);
//     newSearchParams.set("page", pageIndex + 1);
//     newSearchParams.set("pageSize", pageSize);
//     if (debouncedSearchTerm) {
//       newSearchParams.set("search", debouncedSearchTerm);
//     } else {
//       newSearchParams.delete("search");
//     }
//     navigate(`${location.pathname}?${newSearchParams.toString()}`, {
//       replace: true,
//     });
//   }, [pageIndex, pageSize, debouncedSearchTerm, location.pathname, navigate]);

//   const columns = React.useMemo(
//     () => [
//       {
//         Header: "Name",
//         accessor: "customerName",
//         sortType: "alphanumeric",
//       },
//       {
//         Header: "Date",
//         accessor: "selectedDate",
//         sortType: "basic",
//         Cell: ({ value }) => {
//           const formattedDate = format(new Date(value), "dd/MM/yyyy");
//           return formattedDate;
//         },
//       },
//       {
//         Header: "Time Slot",
//         accessor: "selectedTimeSlot",
//         sortType: "basic",
//       },
//       {
//         Header: "Total",
//         accessor: "totalPrice",
//         sortType: "basic",
//         Cell: ({ value }) => `£${value}`,
//       },
//       {
//         Header: "Payment Status",
//         accessor: "paymentStatus",
//         sortType: "basic",
//         Cell: ({ value }) => (value ? value.toUpperCase() : value),
//       },
//       {
//         Header: "Booked By",
//         accessor: "bookedBy",
//         sortType: "basic",
//         Cell: ({ value }) => (value ? value.toUpperCase() : value),
//       },
//       {
//         Header: "Payment",
//         accessor: "paymentMethod",
//         sortType: "basic",
//         Cell: ({ value }) => (value ? value.toUpperCase() : value),
//       },
//       {
//         Header: "Action",
//         accessor: "_id",
//         disableSortBy: true,
//         Cell: ({ row }) => (
//           <div className="flex space-x-2">
//             <button
//               onClick={() => {
//                 setSelectedCustomerId(row.original._id);
//                 setModalOpen(true);
//               }}
//               className="text-blue-500 hover:text-blue-700"
//             >
//               <EllipsisHorizontalIcon className="h-5 w-5" />
//             </button>
//             <button
//               onClick={() => {
//                 setSelectedCustomerId(row.original._id);
//                 setDeleteModalOpen(true);
//               }}
//               className="text-red-500 hover:text-red-700"
//             >
//               <TrashIcon className="h-5 w-5" />
//             </button>
//           </div>
//         ),
//       },
//     ],
//     []
//   );

//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     prepareRow,
//     page,
//     canPreviousPage,
//     canNextPage,
//     pageOptions,
//     pageCount,
//     gotoPage,
//     nextPage,
//     previousPage,
//     setPageSize: setTablePageSize,
//     state: { pageIndex: tablePageIndex, pageSize: tablePageSize, globalFilter },
//     setGlobalFilter,
//   } = useTable(
//     {
//       columns,
//       data: customers,
//       initialState: { pageIndex, pageSize },
//       manualPagination: true,
//       pageCount: totalPages,
//     },
//     useGlobalFilter,
//     useSortBy,
//     usePagination
//   );

//   useEffect(() => {
//     setPageIndex(tablePageIndex);
//   }, [tablePageIndex]);

//   useEffect(() => {
//     setPageSize(tablePageSize);
//   }, [tablePageSize]);

//   const closeModal = useCallback(() => {
//     setModalOpen(false);
//     setSelectedCustomerId(null);
//   }, []);

//   const closeDeleteModal = useCallback(() => {
//     setDeleteModalOpen(false);
//     setSelectedCustomerId(null);
//   }, []);

//   const deleteCustomer = async (id) => {
//     try {
//       const response = await deleteCustomerById(id);
//       toast.success(response?.data?.message);
//       setCustomers(customers.filter((customer) => customer._id !== id));
//     } catch (err) {
//       setError("Failed to delete customer");
//       toast.error(err.response.data.message);
//     }
//   };

//   return (
//     <div className="flex flex-col">
//       <div className="flex items-center mb-4">
//         <MagnifyingGlassCircleIcon className="h-5 w-5 text-gray-500 mr-2" />
//         <input
//           value={searchInput}
//           onChange={(e) => setSearchInput(e.target.value)}
//           placeholder="Search all data..."
//           className="p-2 border rounded w-full"
//         />
//       </div>

//       {loading && (
//         <div className="flex justify-center items-center py-4">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//         </div>
//       )}
//       {error && <p className="text-red-500">{error}</p>}

//       <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
//         <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
//           <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
//             <table
//               {...getTableProps()}
//               className="min-w-full divide-y divide-gray-200"
//             >
//               <thead className="bg-gray-50">
//                 {headerGroups.map((headerGroup, index) => {
//                   const { key, ...headerGroupProps } =
//                     headerGroup.getHeaderGroupProps(); // Destructure to separate key
//                   return (
//                     <tr key={index} {...headerGroupProps}>
//                       {headerGroup.headers.map((column) => {
//                         const { key, ...columnProps } = column.getHeaderProps(
//                           column.getSortByToggleProps()
//                         ); // Destructure to separate key
//                         return (
//                           <th
//                             key={column.id}
//                             {...columnProps}
//                             className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                           >
//                             <div className="flex items-center">
//                               {column.render("Header")}
//                               {column.canSort && (
//                                 <ChevronUpDownIcon className="ml-2 h-4 w-4 text-gray-400" />
//                               )}
//                             </div>
//                           </th>
//                         );
//                       })}
//                     </tr>
//                   );
//                 })}
//               </thead>

//               <tbody
//                 {...getTableBodyProps()}
//                 className="bg-white divide-y divide-gray-200"
//               >
//                 {page.map((row, index) => {
//                   prepareRow(row);
//                   const { key, ...rowProps } = row.getRowProps();
//                   return (
//                     <motion.tr
//                       key={index}
//                       {...rowProps}
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       exit={{ opacity: 0 }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       {row.cells.map((cell, index) => {
//                         const { key, ...cellProps } = cell.getCellProps(); // Destructure to separate key
//                         return (
//                           <motion.td
//                             key={index}
//                             {...cellProps}
//                             className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
//                           >
//                             {cell.render("Cell")}
//                           </motion.td>
//                         );
//                       })}
//                     </motion.tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {/* Improved pagination */}
//           <div className="pagination mt-4 flex justify-between items-center">
//             <div>
//               <span>
//                 Page{" "}
//                 <strong>
//                   {pageIndex + 1} of {pageOptions.length}
//                 </strong>{" "}
//               </span>
//               <select
//                 value={pageSize}
//                 onChange={(e) => setTablePageSize(Number(e.target.value))}
//                 className="ml-2 border rounded p-1"
//               >
//                 {[10, 20, 30, 40, 50].map((pageSize) => (
//                   <option key={pageSize} value={pageSize}>
//                     Show {pageSize}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <motion.button
//                 onClick={() => gotoPage(0)}
//                 disabled={!canPreviousPage}
//                 className="mr-2 px-4 py-2 border rounded bg-gray-200 disabled:opacity-50"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <ChevronDoubleLeftIcon className="w-5 h-5" />
//               </motion.button>
//               <motion.button
//                 onClick={() => previousPage()}
//                 disabled={!canPreviousPage}
//                 className="mr-2 px-4 py-2 border rounded bg-gray-200 disabled:opacity-50"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <ChevronLeftIcon className="w-5 h-5" />
//               </motion.button>
//               <motion.button
//                 onClick={() => nextPage()}
//                 disabled={!canNextPage}
//                 className="mr-2 px-4 py-2 border rounded bg-gray-200 disabled:opacity-50"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <ChevronRightIcon className="w-5 h-5" />
//               </motion.button>
//               <motion.button
//                 onClick={() => gotoPage(pageCount - 1)}
//                 disabled={!canNextPage}
//                 className="px-4 py-2 border rounded bg-gray-200 disabled:opacity-50"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <ChevronDoubleRightIcon className="w-5 h-5" />
//               </motion.button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <AnimatePresence>
//         {modalOpen && (
//           <CustomerInfoModal
//             isOpen={modalOpen}
//             onClose={closeModal}
//             customerId={selectedCustomerId}
//           />
//         )}
//       </AnimatePresence>

//       <AnimatePresence>
//         {deleteModalOpen && (
//           <DeleteConfirmationModal
//             isOpen={deleteModalOpen}
//             onClose={closeDeleteModal}
//             onConfirm={() => {
//               deleteCustomer(selectedCustomerId);
//               closeDeleteModal();
//             }}
//           />
//         )}
//       </AnimatePresence>

//       <ToastContainer
//         position="top-center"
//         autoClose={3000}
//         hideProgressBar={true}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />
//     </div>
//   );
// }

// import React, { useState, useEffect, useCallback } from "react";
// import {
//   useTable,
//   usePagination,
//   useSortBy,
//   useGlobalFilter,
// } from "react-table";
// import { format } from "date-fns";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   ChevronUpDownIcon,
//   MagnifyingGlassCircleIcon,
//   EllipsisHorizontalIcon,
//   PencilSquareIcon,
//   PhotoIcon,
//   TrashIcon,
//   CameraIcon,
//   ReceiptRefundIcon,
// } from "@heroicons/react/24/outline";
// import {
//   ChevronDoubleLeftIcon,
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   ChevronDoubleRightIcon,
// } from "@heroicons/react/24/solid";
// import CustomerInfoModal from "./CustomerInfoModal";
// import DeleteConfirmationModal from "./DeleteConfirmationModal";
// import {
//   deleteCustomerById,
//   getAllDataBooking,
//   refundCustomer,
//   refundForMollieCustomer,
// } from "../../services/api";
// import { useLocation, useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import PhotoGallery from "./PhotoGallery";
// import RefundModal from "./RefundModal";
// import UpdateBookingbyAdminForm from "./UpdateBookingbyAdminForm";
// // Debounce helper function
// const useDebounce = (value, delay) => {
//   const [debouncedValue, setDebouncedValue] = useState(value);

//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedValue(value);
//     }, delay);

//     return () => {
//       clearTimeout(handler);
//     };
//   }, [value, delay]);

//   return debouncedValue;
// };
// export default function Booking() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editModalOpen, setEditModalOpen] = useState(false); // State for edit modal
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [selectedCustomerId, setSelectedCustomerId] = useState(null);
//   const [customers, setCustomers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [totalPages, setTotalPages] = useState(0);
//   const queryParams = new URLSearchParams(location.search);
//   const initialPage = parseInt(queryParams.get("page"), 10) || 1;
//   const initialPageSize = parseInt(queryParams.get("pageSize"), 10) || 10;
//   const [pageIndex, setPageIndex] = useState(initialPage - 1);
//   const [pageSize, setPageSize] = useState(initialPageSize);
//   const [searchInput, setSearchInput] = useState("");
//   const debouncedSearchTerm = useDebounce(searchInput, 500);
//   // const [selectedPhotos, setSelectedPhotos] = useState([]);
//   // const [isGalleryOpen, setIsGalleryOpen] = useState(false);
//   // const [refundModalOpen, setRefundModalOpen] = useState(false);
//   // const [refundAmount, setRefundAmount] = useState("");
//   // const [OrderId, setOrderId] = useState("");
//   // const [selectedBooking, setSelectedBooking] = useState(null);
//   // const [refundReason, setRefundReason] = useState("");
//   // const [isProcessing, setIsProcessing] = useState(false);
//   // const [isSuccess, setIsSuccess] = useState(false);

//   const fetchCustomers = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await getAllDataBooking(
//         pageIndex,
//         pageSize,
//         debouncedSearchTerm
//       );
//       setCustomers(response.data.data.customers);
//       setTotalPages(response.data.data.totalPages);
//     } catch (err) {
//       if (err.response?.data?.message === "Unauthorized request") {
//         navigate("/login");
//       }
//       setError(err.response?.data?.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [pageIndex, pageSize, debouncedSearchTerm, navigate]);

//   // Effect for fetching data when search term changes
//   useEffect(() => {
//     fetchCustomers();
//   }, [fetchCustomers]);

//   // useEffect(() => {
//   //   fetchCustomers();
//   // }, [fetchCustomers]);

//   useEffect(() => {
//     setPageIndex(0);
//   }, [searchInput]);

//   // Effect for updating URL params
//   useEffect(() => {
//     const newSearchParams = new URLSearchParams(location.search);
//     newSearchParams.set("page", pageIndex + 1);
//     newSearchParams.set("pageSize", pageSize);
//     if (debouncedSearchTerm) {
//       newSearchParams.set("search", debouncedSearchTerm);
//     } else {
//       newSearchParams.delete("search");
//     }
//     navigate(`${location.pathname}?${newSearchParams.toString()}`, {
//       replace: true,
//     });
//   }, [pageIndex, pageSize, debouncedSearchTerm, location.pathname, navigate]);

//   // const handleRefundClick = (booking) => {
//   //   setSelectedBooking(booking);
//   //   setRefundAmount(booking.totalPrice);
//   //   setRefundModalOpen(true);
//   // };

//   // const handleRefund = async () => {
//   //   if (!selectedBooking || !refundAmount || !refundReason) {
//   //     toast.error("Please fill in all required fields");
//   //     return;
//   //   }

//   //   setIsProcessing(true);

//   //   try {
//   //     let response;

//   //     // Check if the payment method is PayPal or Mollie and call the appropriate function
//   //     if (selectedBooking.paymentMethod === "PayPal") {
//   //       response = await refundCustomer(
//   //         selectedBooking.captureId,
//   //         refundAmount,
//   //         refundReason
//   //       );
//   //     } else if (selectedBooking.paymentMethod === "Mollie") {
//   //       response = await refundForMollieCustomer(
//   //         selectedBooking._id,
//   //         refundAmount,
//   //         refundReason
//   //       );
//   //     } else {
//   //       toast.error("Unsupported payment method");
//   //       return;
//   //     }

//   //     if (response.status === 200) {
//   //       fetchCustomers();
//   //       setIsSuccess(true);
//   //     }
//   //   } catch (err) {
//   //     const errorMessage =
//   //       err.response?.data?.message || "Failed to process refund";
//   //     toast.error(errorMessage);
//   //   } finally {
//   //     setIsProcessing(false);
//   //   }
//   // };

//   const columns = React.useMemo(
//     () => [
//       {
//         Header: "Name",
//         accessor: "customerName",
//         sortType: "alphanumeric",
//       },
//       {
//         Header: "Date",
//         accessor: "selectedDate",
//         sortType: "basic",
//         Cell: ({ value }) => {
//           const formattedDate = format(new Date(value), "dd/MM/yyyy");
//           return formattedDate;
//         },
//       },
//       {
//         Header: "Time Slot",
//         accessor: "selectedTimeSlot",
//         sortType: "basic",
//       },
//       {
//         Header: "Total",
//         accessor: "totalPrice",
//         sortType: "basic",
//         Cell: ({ value }) => `£${value}`,
//       },
//       {
//         Header: "Payment Status",
//         accessor: "paymentStatus",
//         sortType: "basic",
//         Cell: ({ value }) => (value ? value.toUpperCase() : value),
//       },
//       {
//         Header: "Booked By",
//         accessor: "bookedBy",
//         sortType: "basic",
//         Cell: ({ value }) => (value ? value.toUpperCase() : value),
//       },
//       {
//         Header: "Payment",
//         accessor: "paymentMethod",
//         sortType: "basic",
//         Cell: ({ value }) => (value ? value.toUpperCase() : value),
//       },
//       {
//         Header: "Action",
//         accessor: "_id",
//         disableSortBy: true,
//         Cell: ({ row }) => (
//           <div className="flex space-x-2">
//             <button
//               onClick={() => {
//                 setSelectedCustomerId(row.original._id);
//                 setModalOpen(true);
//               }}
//               className="text-blue-500 hover:text-blue-700"
//             >
//               <EllipsisHorizontalIcon className="h-5 w-5" />
//             </button>
//             {/* <button
//               onClick={() => {
//                 setSelectedCustomerId(row.original._id);
//                 setEditModalOpen(true); // Open edit modal
//               }}
//               className="text-blue-500 hover:text-blue-700"
//             >
//               <PencilSquareIcon className="h-5 w-5" />
//             </button> */}
//             <button
//               onClick={() => {
//                 setSelectedCustomerId(row.original._id);
//                 setDeleteModalOpen(true);
//               }}
//               className="text-red-500 hover:text-red-700"
//             >
//               <TrashIcon className="h-5 w-5" />
//             </button>
//             {/* <button
//               onClick={() => handleRefundClick(row.original)}
//               className={`text-green-500 flex items-center ${
//                 row.original.refundStatus === "completed"
//                   ? "opacity-50 cursor-not-allowed"
//                   : "hover:text-green-700"
//               }`}
//               disabled={row.original.refundStatus === "completed"}
//             >
//               <ReceiptRefundIcon className="h-5 w-5" />
//             </button> */}
//           </div>
//         ),
//       },
//     ],
//     []
//   );

//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     prepareRow,
//     page,
//     canPreviousPage,
//     canNextPage,
//     pageOptions,
//     pageCount,
//     gotoPage,
//     nextPage,
//     previousPage,
//     setPageSize: setTablePageSize,
//     state: { pageIndex: tablePageIndex, pageSize: tablePageSize, globalFilter },
//     setGlobalFilter,
//   } = useTable(
//     {
//       columns,
//       data: customers,
//       initialState: { pageIndex, pageSize },
//       manualPagination: true,
//       pageCount: totalPages,
//     },
//     useGlobalFilter,
//     useSortBy,
//     usePagination
//   );

//   useEffect(() => {
//     setPageIndex(tablePageIndex);
//   }, [tablePageIndex]);

//   useEffect(() => {
//     setPageSize(tablePageSize);
//   }, [tablePageSize]);

//   const closeModal = useCallback(() => {
//     setModalOpen(false);
//     setSelectedCustomerId(null);
//   }, []);

//   const closeDeleteModal = useCallback(() => {
//     setDeleteModalOpen(false);
//     setSelectedCustomerId(null);
//   }, []);

//   const deleteCustomer = async (id) => {
//     try {
//       const response = await deleteCustomerById(id);
//       toast.success(response?.data?.message);
//       setCustomers(customers.filter((customer) => customer._id !== id));
//     } catch (err) {
//       setError("Failed to delete customer");
//       toast.error(err.response.data.message);
//     }
//   };

//   return (
//     <div className="flex flex-col">
//       <div className="flex items-center mb-4">
//         <MagnifyingGlassCircleIcon className="h-5 w-5 text-gray-500 mr-2" />
//         <input
//           value={searchInput}
//           onChange={(e) => setSearchInput(e.target.value)}
//           placeholder="Search all data..."
//           className="p-2 border rounded w-full"
//         />
//       </div>

//       {loading && (
//         <div className="flex justify-center items-center py-4">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//         </div>
//       )}
//       {error && <p className="text-red-500">{error}</p>}

//       <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
//         <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
//           <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
//             <table
//               {...getTableProps()}
//               className="min-w-full divide-y divide-gray-200"
//             >
//               <thead className="bg-gray-50">
//                 {headerGroups.map((headerGroup, index) => {
//                   const { key, ...headerGroupProps } =
//                     headerGroup.getHeaderGroupProps(); // Destructure to separate key
//                   return (
//                     <tr key={index} {...headerGroupProps}>
//                       {headerGroup.headers.map((column) => {
//                         const { key, ...columnProps } = column.getHeaderProps(
//                           column.getSortByToggleProps()
//                         ); // Destructure to separate key
//                         return (
//                           <th
//                             key={column.id}
//                             {...columnProps}
//                             className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
//                           >
//                             <div className="flex items-center">
//                               {column.render("Header")}
//                               {column.canSort && (
//                                 <ChevronUpDownIcon className="ml-2 h-4 w-4 text-gray-400" />
//                               )}
//                             </div>
//                           </th>
//                         );
//                       })}
//                     </tr>
//                   );
//                 })}
//               </thead>

//               <tbody
//                 {...getTableBodyProps()}
//                 className="bg-white divide-y divide-gray-200"
//               >
//                 {page.map((row, index) => {
//                   prepareRow(row);
//                   const { key, ...rowProps } = row.getRowProps();
//                   return (
//                     <motion.tr
//                       key={index}
//                       {...rowProps}
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       exit={{ opacity: 0 }}
//                       transition={{ duration: 0.3 }}
//                     >
//                       {row.cells.map((cell, index) => {
//                         const { key, ...cellProps } = cell.getCellProps(); // Destructure to separate key
//                         return (
//                           <motion.td
//                             key={index}
//                             {...cellProps}
//                             className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
//                           >
//                             {cell.render("Cell")}
//                           </motion.td>
//                         );
//                       })}
//                     </motion.tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {/* Improved pagination */}
//           <div className="pagination mt-4 flex justify-between items-center">
//             <div>
//               <span>
//                 Page{" "}
//                 <strong>
//                   {pageIndex + 1} of {pageOptions.length}
//                 </strong>{" "}
//               </span>
//               <select
//                 value={pageSize}
//                 onChange={(e) => setTablePageSize(Number(e.target.value))}
//                 className="ml-2 border rounded p-1"
//               >
//                 {[10, 20, 30, 40, 50].map((pageSize) => (
//                   <option key={pageSize} value={pageSize}>
//                     Show {pageSize}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <motion.button
//                 onClick={() => gotoPage(0)}
//                 disabled={!canPreviousPage}
//                 className="mr-2 px-4 py-2 border rounded bg-gray-200 disabled:opacity-50"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <ChevronDoubleLeftIcon className="w-5 h-5" />
//               </motion.button>
//               <motion.button
//                 onClick={() => previousPage()}
//                 disabled={!canPreviousPage}
//                 className="mr-2 px-4 py-2 border rounded bg-gray-200 disabled:opacity-50"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <ChevronLeftIcon className="w-5 h-5" />
//               </motion.button>
//               <motion.button
//                 onClick={() => nextPage()}
//                 disabled={!canNextPage}
//                 className="mr-2 px-4 py-2 border rounded bg-gray-200 disabled:opacity-50"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <ChevronRightIcon className="w-5 h-5" />
//               </motion.button>
//               <motion.button
//                 onClick={() => gotoPage(pageCount - 1)}
//                 disabled={!canNextPage}
//                 className="px-4 py-2 border rounded bg-gray-200 disabled:opacity-50"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <ChevronDoubleRightIcon className="w-5 h-5" />
//               </motion.button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <AnimatePresence>
//         {modalOpen && (
//           <CustomerInfoModal
//             isOpen={modalOpen}
//             onClose={closeModal}
//             customerId={selectedCustomerId}
//           />
//         )}
//       </AnimatePresence>

//       <AnimatePresence>
//         {deleteModalOpen && (
//           <DeleteConfirmationModal
//             isOpen={deleteModalOpen}
//             onClose={closeDeleteModal}
//             onConfirm={() => {
//               deleteCustomer(selectedCustomerId);
//               closeDeleteModal();
//             }}
//           />
//         )}
//       </AnimatePresence>

//       {/* <AnimatePresence>
//         <RefundModal
//           isOpen={refundModalOpen}
//           closeModal={() => {
//             setRefundModalOpen(false);
//             setIsSuccess(false);
//           }}
//           // closeModal={() => setRefundModalOpen(false)}
//           booking={selectedBooking}
//           refundAmount={refundAmount}
//           setRefundAmount={setRefundAmount}
//           refundReason={refundReason}
//           setRefundReason={setRefundReason}
//           handleRefund={handleRefund}
//           isProcessing={isProcessing}
//           isSuccess={isSuccess}
//         />
//       </AnimatePresence> */}

//       <ToastContainer
//         position="top-center"
//         autoClose={3000}
//         hideProgressBar={true}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />
//     </div>
//   );
// }
