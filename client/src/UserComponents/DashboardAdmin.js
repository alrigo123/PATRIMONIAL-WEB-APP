import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";

const URL = process.env.REACT_APP_API_URL_USER;

const DashboardAdmin = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate("/"); // Redirect to login page if no token
      return;
    }

    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken'); // Get the stored token

      if (!token) {
        console.error("No token found, redirecting...");
        navigate("/"); // Redirect to login or home if no token
        return;
      }

      const response = await axios.get(`${URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}` // ✅ Send token in the request
        }
      });

      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDelete = async (dni) => {
    try {
      await axios.delete(`${URL}/users/${dni}`);
      setUsers(users.filter(user => user.dni !== dni));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Function to handle status toggle
  const handleStatusChange = async (dni, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1; // Toggle status

    try {
      // console.log(`🔄 Sending request to update status for DNI: ${dni} to ${newStatus}`);
      const response = await axios.put(`${URL}/${dni}/status`, { status: newStatus });

      if (response.status === 200) {
        setUsers(prevUsers => prevUsers.map(user =>
          user.dni === dni ? { ...user, status: newStatus } : user
        ));
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">📋 Lista de Usuarios</h1>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>DNI</th>
              <th>Nombre y Apellido</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.dni}>
                <td>{user.dni}</td>
                <td>{user.name_and_last}</td>
                <td className="d-flex justify-content-center align-items-center gap-2">
                  <div className="form-check form-switch m-0">
                    <input
                      className={`form-check-input ${user.status === 0 ? "bg-danger" : "bg-success"}`}
                      type="checkbox"
                      checked={user.status === 1}
                      disabled={user.disabled} // Example condition for disabling switch
                      onChange={() => handleStatusChange(user.dni, user.status)}
                    />
                  </div>
                  <span className={user.status === 1 ? "text-success fw-bold" : "text-danger fw-bold"}>
                    {user.status === 1 ? "Activo" : "Inactivo"}
                  </span>
                </td>

                <td>
                  <button
                    onClick={() => handleDelete(user.dni)}
                    className="btn btn-danger btn-sm me-2"
                  >
                    🗑 Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="m-3">
          <Link to="/user-register" className="btn btn-primary w-50 shadow-sm fw-bold">
            Registro de Usuarios
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DashboardAdmin
