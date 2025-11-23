import React, { useState, useEffect } from 'react';
import { teamAPI } from '../services/api';
import TeamForm from '../components/TeamForm';
import './Pages.css';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await teamAPI.getAll();
      setTeams(response.data.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedTeam(null);
    setShowForm(true);
  };

  const handleEdit = (team) => {
    setSelectedTeam(team);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await teamAPI.delete(id);
        fetchTeams();
      } catch (error) {
        console.error('Error deleting team:', error);
        alert('Failed to delete team');
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedTeam(null);
    fetchTeams();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedTeam(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Teams</h1>
        {!showForm && (
          <button onClick={handleAdd} className="btn-primary">
            Add Team
          </button>
        )}
      </div>

      {showForm ? (
        <TeamForm
          team={selectedTeam}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Team Name</th>
                <th>Description</th>
                <th>Members</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.length === 0 ? (
                <tr>
                  <td colSpan="4" className="no-data">
                    No teams found. Click "Add Team" to create one.
                  </td>
                </tr>
              ) : (
                teams.map(team => (
                  <tr key={team.id}>
                    <td>{team.name}</td>
                    <td>{team.description || '-'}</td>
                    <td>
                      {team.employees?.length || 0} member(s)
                    </td>
                    <td className="actions">
                      <button
                        onClick={() => handleEdit(team)}
                        className="btn-edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(team.id)}
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

export default Teams;
