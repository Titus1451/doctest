'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { Select, MenuItem } from '@material-ui/core';
import { roles } from '@/app/components/constants';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import UIButton from '@/app/components/common/components/Button';

const RegisterForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const roleValues = Object.values(roles);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // check is all fields are filled
    if (!firstName || !lastName || !email || !password || !role) {
      toast.error('Please fill in all fields');

      return;
    }
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      toast.error('Please enter a valid name.');
      return;
    }

    // check if email is a valid email

    const emailRegex = /^[^\s@]+@7-11\.com$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a 7-Eleven email');
      return;
    }

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      toast.error(
        'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
      );
      return;
    }

    // check if user exists
    const checkUserExists = async () => {
      const resUserExist = await fetch('/api/auth/userExists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const { user } = await resUserExist.json();
      if (user) {
        throw new Error('User already exists');
      }
      return user; // If user doesn't exist, proceed
    };

    const registerUser = async () => {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          role,
        }),
      });
      const data = await res.json();
      console.log('Data:', data);
      if (!res.ok && data.error) {
        throw new Error(data.error);
      }
      return data; // Successfully registered
    };

    checkUserExists()
      .then(() => {
        // Proceed to register the user if checkUserExists resolves
        return registerUser();
      })
      .then((registrationResult) => {
        // Handle successful registration
        toast.success('User successfully registered!');
        //console.log('Registration Result:', registrationResult);
        router.push('/login');
      })
      .catch((error) => {
        // Handle any error from either operation
        toast.error(error.toString());
        console.error('Error:', error);
      });
  };

  return (
    <div>
    <div
    style={{
      position: 'fixed', // Ensures it remains centered
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)', // Centers it precisely
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100vw',
      height: '100vh',
      backgroundColor: '#f5f5f5', // Optional: background color for the page
    }}
  >
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '600px',
        backgroundColor: '#fff',
        padding: '20px', // Increased padding for better spacing
        borderRadius: '8px',
        boxShadow: '0px 0px 10px rgba(20, 115, 79, 0.2)',
      }}
    >
         <h1
            className="font-right-grotesk text-xl"
            style={{ marginBottom: '2px' }}
          >
            Register
          </h1>

        <form 
            onSubmit={handleSubmit}
            style={{
            display: 'flex',
            padding: '20px',
            flexDirection: 'column',
            alignItems: 'center',
            width: '400px',
          }}>

        <style>
              {`
          input::placeholder {
            text-align: left;
            //color: #14734f;
          }
            
        `}
            </style>
          <input
            onChange={(e) => setFirstName(e.target.value)}
            type="text"
            placeholder="First Name"
            style={{
                width: '100%',
                padding: '5px',
                marginBottom: '5px',
                borderRadius: '4px',
                border: '1px solid #ddd',
              }}
              className=" outline-custom-green-above"
          />
            <input
            onChange={(e) => setLastName(e.target.value)}
            type="text"
            placeholder="Last Name"
            style={{
                width: '100%',
                padding: '5px',
                marginBottom: '5px',
                borderRadius: '4px',
                border: '1px solid #ddd',
              }}
              className=" outline-custom-green-above"
          />
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Email"
            style={{
                width: '100%',
                padding: '5px',
                marginBottom: '5px',
                borderRadius: '4px',
                border: '1px solid #ddd',
              }}
              className=" outline-custom-green-above"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            style={{
                width: '100%',
                padding: '5px',
                marginBottom: '5px',
                borderRadius: '4px',
                border: '1px solid #ddd',
              }}
              className=" outline-custom-green-above"
          />
          <div>Select Desired Role</div>
          <Select
            style={{
                width: '100%',
                padding: '5px',
                marginBottom: '5px',
                borderRadius: '4px',
                border: '1px solid #ddd',
              }}
              className=" outline-custom-green-above"
            onChange={(e) => setRole(e.target.value)}
            name="role"
            displayEmpty
            renderValue={(selected) => {
              if (selected === '') {
                return <em>Select Desired Role</em>;
              }
              // Find the role with the selected value and return its display text
              const selectedRole = roleValues.find(
                (role) => role[0] === selected,
              );
              return selectedRole ? selectedRole[1] : selected;
            }}
          >
            <MenuItem value="" disabled>
              Select Desired Role
            </MenuItem>
            {roleValues.map((role, index) => (
              <MenuItem key={index} value={role[0]}>
                {role[1]}
              </MenuItem>
            ))}
          </Select>
          <div className="text-md mt-2">
              <UIButton type="submit" text="Register" />
            </div>

          <Link className="mt-3 text-right text-sm" href={'/login'}>
            Already have an account?{' '}
            <span className="text-green-500 hover:underline">Login</span>
          </Link>
        </form>
      </div>
    </div>
    </div>
  );
};

export default RegisterForm;
