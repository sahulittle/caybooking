// frontend/src/components/RoleSwitchModal.jsx
/**
 * Role Switch Modal - Handles switching between roles
 * User must log out from current role and log in with new role
 * This ensures token is updated with new activeRole
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getActiveRole, getUserRoles } from '../utils/roleGuard';

const RoleSwitchModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const currentRole = getActiveRole();
  const availableRoles = getUserRoles().filter(role => role !== currentRole);

  const handleRoleSwitch = async (newRole) => {
    setLoading(true);
    
    // Clear current session
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Show notification
    toast.success(`Logged out from '${currentRole}'. Please log in as '${newRole}'.`);
    
    // Redirect to login with role pre-selected
    navigate('/login', { state: { role: newRole, switched: true } });
    
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4">Switch Role</h3>
        
        <p className="text-gray-600 mb-4">
          You are currently logged in as <span className="font-semibold capitalize">{currentRole}</span>.
        </p>
        
        <p className="text-gray-600 mb-6">
          To switch roles, you'll need to log out and log back in with the new role.
        </p>

        {availableRoles.length === 0 ? (
          <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
            You don't have other roles assigned. Contact an admin to assign additional roles.
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {availableRoles.map(role => (
              <button
                key={role}
                onClick={() => handleRoleSwitch(role)}
                disabled={loading}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition capitalize font-medium"
              >
                Switch to {role}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          disabled={loading}
          className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RoleSwitchModal;
