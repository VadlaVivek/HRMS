import React, { useState, useEffect } from 'react';
import { employeeAPI } from '../services/api';
import EmployeeForm from '../components/EmployeeForm';
import './Pages.css';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await employeeAPI.getAll();
      setEmployees(response.data.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedEmployee(null);
    setShowForm(true);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeAPI.delete(id);
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee');
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedEmployee(null);
    fetchEmployees();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedEmployee(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Employees</h1>
        {!showForm && (
          <button onClick={handleAdd} className="btn-primary">
            Add Employee
          </button>
        )}
      </div>

      {showForm ? (
        <EmployeeForm
          employee={selectedEmployee}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Position</th>
                <th>Department</th>
                <th>Teams</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">
                    No employees found. Click "Add Employee" to create one.
                  </td>
                </tr>
              ) : (
                employees.map(employee => (
                  <tr key={employee.id}>
                    <td>{employee.firstname} {employee.lastname}</td>
                    <td>{employee.email}</td>
                    <td>{employee.phone || '-'}</td>
                    <td>{employee.position || '-'}</td>
                    <td>{employee.department || '-'}</td>
                    <td>
                      {employee.teams?.map(team => (
                        <span key={team.id} className="badge">
                          {team.name}
                        </span>
                      ))}
                    </td>
                    <td className="actions">
                      <button
                        onClick={() => handleEdit(employee)}
                        className="btn-edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(employee.id)}
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Employees;
