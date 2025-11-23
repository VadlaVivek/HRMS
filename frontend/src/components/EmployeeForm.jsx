import React, { useState, useEffect } from 'react';
import { employeeAPI, teamAPI } from '../services/api';
import './EmployeeForm.css';

const EmployeeForm = ({ employee, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    position: '',
    department: ''
  });
  const [teams, setTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (employee) {
      setFormData({
        firstname: employee.firstname || '',
        lastname: employee.lastname || '',
        email: employee.email || '',
        phone: employee.phone || '',
        position: employee.position || '',
        department: employee.department || ''
      });
      setSelectedTeams(employee.teams?.map(t => t.id) || []);
    }
    fetchTeams();
  }, [employee]);

  const fetchTeams = async () => {
    try {
      const response = await teamAPI.getAll();
      setTeams(response.data.data);
    } catch (err) {
      console.error('Error fetching teams:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTeamToggle = (teamId) => {
    setSelectedTeams(prev =>
      prev.includes(teamId)
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (employee) {
        // Update employee
        await employeeAPI.update(employee.id, formData);

        // Update team assignments
        const currentTeamIds = employee.teams?.map(t => t.id) || [];
        const teamsToAdd = selectedTeams.filter(id => !currentTeamIds.includes(id));
        const teamsToRemove = currentTeamIds.filter(id => !selectedTeams.includes(id));

        for (const teamId of teamsToAdd) {
          await employeeAPI.assignTeam(employee.id, teamId);
        }
        for (const teamId of teamsToRemove) {
          await employeeAPI.unassignTeam(employee.id, teamId);
        }
      } else {
        // Create employee
        const response = await employeeAPI.create(formData);
        const newEmployeeId = response.data.data.id;

        // Assign teams
        for (const teamId of selectedTeams) {
          await employeeAPI.assignTeam(newEmployeeId, teamId);
        }
      }

      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>{employee ? 'Edit Employee' : 'Add New Employee'}</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>First Name *</label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Last Name *</label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Position</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Assign Teams</label>
          <div className="team-checkboxes">
            {teams.map(team => (
              <label key={team.id} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedTeams.includes(team.id)}
                  onChange={() => handleTeamToggle(team.id)}
                />
                {team.name}
              </label>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Saving...' : employee ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
