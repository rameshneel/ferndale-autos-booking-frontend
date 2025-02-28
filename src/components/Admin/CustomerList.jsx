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
        Header: "Booked Date",
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
      // {
      //   Header: "Booked By",
      //   accessor: "bookedBy",
      //   sortType: "basic",
      //   Cell: ({ value }) => (value ? value.toUpperCase() : "N/A"),
      // },
      {
        Header: "Booked Method",
        accessor: "bookedBy",
        sortType: "basic",
        Cell: ({ value, row }) => {
          const bookedBy = value ? value.toUpperCase() : "N/A";
          const bookingMethod =
            row.original.bookedBy === "admin" ? "OFFLINE" : "ONLINE";

          return `${bookingMethod}`;
        },
      },
      {
        Header: "Created At",
        accessor: "createdAt",
        sortType: "basic",
        Cell: ({ value }) => format(new Date(value), "dd/MM/yyyy"),
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
        theme="dark"
      />
    </div>
  );
};

export default Booking;
