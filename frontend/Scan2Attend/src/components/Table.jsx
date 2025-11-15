import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAttendance } from "../lib/attendanceApi";

const Table = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // items per page

  // const [getData, setData] = useState({
  //   attendance:'',
  //   loading:'',
  //   error:'',
  //   page:'',
  //   totalPages:'',
  // })

  // Fetch data from API
  const fetchAttendance = async (page) => {
    try {
      setLoading(true);
      const response = await getAttendance({
        params: { page, limit },
      });
      setAttendance(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError(err.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance(page);
  }, [page]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Attendance Records</h2>
      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Student ID</th>
            <th>Subject</th>
            <th>Date</th>
            <th>Status</th>
            <th>Teacher</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((item) => (
            <tr key={item._id}>
              <td>{item.studentDetails?.fullName || "N/A"}</td>
              <td>{item.studentID}</td>
              <td>{item.subjectCode}</td>
              <td>{new Date(item.date).toLocaleDateString()}</td>
              <td>{item.status}</td>
              <td>{item.teacherDetails?.fullName || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ marginTop: "10px" }}>
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;
