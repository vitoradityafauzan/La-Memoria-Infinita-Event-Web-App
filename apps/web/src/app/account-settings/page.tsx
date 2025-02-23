'use client';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getToken } from '@/lib/server';
import base_url from '@/lib/user';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '@/type/user';

const AccountInfo = () => {
  const [selectedTab, setSelectedTab] = useState('contact');
  const [firstName, setFirstName] = useState('');
  const [newFirstName, setNewFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error('No token found');

        // Decode the token to get user info
        const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);
        const userId = decodedToken.id;

        if (!userId) throw new Error('User ID not found in token');

        const response = await fetch(`${base_url}/user/${userId}`, {
          // Adjusted URL to use user ID
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setFirstName(data.user.firstName);
          setLastName(data.user.lastName);
          setPhone(data.user.phone);
          setEmail(data.user.email);
        } else {
          toast.error(data.msg || 'Failed to fetch user data.');
        }
      } catch (error) {
        toast.error('An error occurred while fetching user data.');
      }
    };

    fetchData();
  }, []);

  const handleUpdate = async () => {
    try {
      const token = await getToken();
      if (!token) throw new Error('No token found');

      const updateData: any = {};

      if (newFirstName) updateData.firstName = newFirstName;
      if (newLastName) updateData.lastName = newLastName;
      if (newPhone) updateData.phone = newPhone;
      if (newEmail) updateData.email = newEmail;
      if (newPassword) {
        updateData.password = newPassword;
        updateData.currentPassword = currentPassword;
      }

      if (Object.keys(updateData).length === 0) {
        toast.error('No changes detected.');
        return;
      }

      const response = await fetch(`${base_url}/user/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        if (newFirstName) toast.success('First name updated successfully!');
        if (newLastName) toast.success('Last name updated successfully!');
        if (newPhone) toast.success('Phone number updated successfully!');
        if (newEmail) toast.success('Email updated successfully!');
        if (newPassword) toast.success('Password updated successfully!');
      } else {
        toast.error(data.msg || 'Update failed.');
      }
      setNewFirstName('');
      setNewLastName('');
      setNewPhone('');
      setNewEmail('');
      setCurrentPassword('');
      setNewPassword('');
      setRepeatPassword('');
    } catch (error) {
      console.error('Error updating user data:', error);
      toast.error('An error occurred.');
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== repeatPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    handleUpdate();
    setPasswordError('');
  };

  // form and style //

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    minHeight: '68.4vh',
    backgroundColor: '#f9f9f9',
    paddingTop: '0px',
  };

  const sidebarStyle: React.CSSProperties = {
    width: '300px',
    backgroundColor: '#f5f5f5',
    padding: '40px 20px 20px 40px',
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: '0px',
    bottom: '0px',
    height: '68.4vh',
    alignSelf: 'flex-start',
  };

  const sidebarItemStyle = (isActive: boolean): React.CSSProperties => ({
    padding: '15px 20px',
    margin: '10px 0',
    cursor: 'pointer',
    backgroundColor: isActive ? '#ccc' : undefined,
    transition: 'background-color 0.3s ease',
  });

  const contentStyle: React.CSSProperties = {
    flex: '1',
    padding: '40px 20px 20px 50px',
  };

  const formContainerStyle: React.CSSProperties = {
    maxWidth: '600px',
  };

  const headingStyle: React.CSSProperties = {
    marginBottom: '20px',
    fontSize: '24px',
    color: '#333',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#555',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    marginBottom: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  };

  const saveButtonStyle: React.CSSProperties = {
    padding: '10px 20px',
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  };

  return (
    <div style={containerStyle}>
      <div style={sidebarStyle}>
        <div
          style={sidebarItemStyle(selectedTab === 'contact')}
          onClick={() => setSelectedTab('contact')}
        >
          Contact Info
        </div>
        <div
          style={sidebarItemStyle(selectedTab === 'email')}
          onClick={() => setSelectedTab('email')}
        >
          Change Email
        </div>
        <div
          style={sidebarItemStyle(selectedTab === 'password')}
          onClick={() => setSelectedTab('password')}
        >
          Change Password
        </div>
      </div>
      <div style={contentStyle}>
        {selectedTab === 'contact' && (
          <div style={formContainerStyle}>
            <h2 style={headingStyle}>Contact Info</h2>
            <form>
              <label style={labelStyle}>
                First Name :{' '}
                <span className="hover:text-blue-600">{firstName}</span>
              </label>
              <input
                placeholder="Change First Name"
                style={inputStyle}
                type="text"
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}
              />
              <label style={labelStyle}>
                Last Name :{' '}
                <span className="hover:text-blue-600">{lastName}</span>
              </label>
              <input
                placeholder="Change Last Name"
                style={inputStyle}
                type="text"
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
              />
              <label style={labelStyle}>
                Phone Number :{' '}
                <span className="hover:text-blue-600">{phone}</span>
              </label>
              <input
                placeholder="Change Phone Number"
                style={inputStyle}
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
              />
              <button
                type="button"
                onClick={handleUpdate}
                style={saveButtonStyle}
              >
                Save Changes
              </button>
            </form>
          </div>
        )}
        {selectedTab === 'email' && (
          <div style={formContainerStyle}>
            <h2 style={headingStyle}>Change Email</h2>
            <form>
              <h1 className="text-xl p-3">
                Current Email : <span className="font-semibold">{email}</span>
              </h1>
              <label style={labelStyle}>New Email</label>
              <input
                style={inputStyle}
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <label style={labelStyle}>Confirm New Email</label>
              <input
                style={inputStyle}
                type="email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
              />
              <button
                type="button"
                onClick={handleUpdate}
                style={saveButtonStyle}
              >
                Save Changes
              </button>
            </form>
          </div>
        )}
        {selectedTab === 'password' && (
          <div style={formContainerStyle}>
            <h2 style={headingStyle}>Change Password</h2>
            <form onSubmit={handlePasswordSubmit}>
              <label style={labelStyle}>Current Password</label>
              <input
                style={inputStyle}
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <label style={labelStyle}>New Password</label>
              <input
                style={inputStyle}
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <label style={labelStyle}>Repeat New Password</label>
              <input
                style={inputStyle}
                type="password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
              {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
              <button type="submit" style={saveButtonStyle}>
                Change Password
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountInfo;
