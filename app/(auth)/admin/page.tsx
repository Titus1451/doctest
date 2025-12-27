'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import UIButton from '@/app/components/common/components/Button';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [rowData, setRowData] = useState([]);
  const gridRef = useRef(null);
  const [gridApi, setGridApi] = useState(null);

  // Call the DELETE API route to remove the user from the database
  const onDeleteUser = async (userId) => {
    try {
      const res = await fetch('/api/auth/deleteUser', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error('Deletion failed');
      // Remove the user from the grid after successful deletion.
      setRowData((prevData) => prevData.filter((user) => user._id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Error deleting user');
    }
  };

  // Define the AG Grid column definitions.
  const [columnDefs] = useState([
    { headerName: 'First Name', field: 'firstName', editable: false },
    { headerName: 'Last Name', field: 'lastName', editable: false },
    { headerName: 'Email', field: 'email', editable: false },
    {
      headerName: 'Role',
      field: 'role',
      editable: (params) => params.data.role !== 'ADMIN',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['TAX_TECH', 'SALES_TAX', 'INCOME_TAX'],
      },
    },
    {
      headerName: 'Approved',
      field: 'isApproved',
      editable: (params) => params.data.role !== 'ADMIN',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: [true, false],
      },
      cellRenderer: (params) => (params.value ? 'Yes' : 'No'),
    },
    {
      headerName: 'Actions',
      field: 'actions',
      editable: false,
      cellRenderer: (params) => {
        // Do not render a delete button if the user's role is ADMIN.
        if (params.data.role === 'ADMIN') {
          return null;
        }
        return (
          <div
            onClick={() => {
              const confirmDelete = window.confirm(
                `Are you sure you want to delete user "${params.data.email}"?`
              );
              if (confirmDelete) {
                onDeleteUser(params.data._id);
              }
            }}
            style={{ padding: '0.25rem 0.5rem', cursor: 'pointer' }}
          >
            <TrashIcon
              className="h-5 w-5 text-custom-orange"
              style={{ cursor: 'pointer' }}
            />
          </div>
        );
      },
    },
  ]);

  // onGridReady: store grid API and show loading overlay.
  const onGridReady = (params) => {
    setGridApi(params.api);
    params.api.showLoadingOverlay();
  };

  // Show/hide loading overlay based on rowData.
  useEffect(() => {
    if (gridApi) {
      if (!rowData || (Array.isArray(rowData) && rowData.length === 0)) {
        gridApi.showLoadingOverlay();
      } else {
        gridApi.hideOverlay();
      }
    }
  }, [gridApi, rowData]);

  // Fetch users data from the API when the component mounts.
  useEffect(() => {
    fetch('/api/auth/getUsers')
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched users:', data);
        setRowData(data.users || []);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        toast.error('Failed to fetch users');
      });
  }, []);

  // When the admin clicks Confirm Changes, send the updated rows to the API.
  const onConfirmChanges = async () => {
    try {
      const res = await fetch('/api/auth/updateUsers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users: rowData }),
      });
      if (!res.ok) throw new Error('Update failed');
      toast.success('Changes saved successfully');
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('Error saving changes');
    }
  };

  // Session and role checks.
  useEffect(() => {
    if (status === 'loading') return; // Wait until we have a definitive status

    if (status === 'unauthenticated') {
      toast.error('You are not authorized to view this page. Please log in.');
      router.push('/dashboard/getStoreData');
      return;
    }

    if (session && session.user?.role !== 'TAX_TECH') {
      toast.error(
        'You are not authorized to view this page with your current credentials. Please contact your administrator.'
      );
      router.push('/dashboard/getStoreData');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return null;
  }

  if (!session || session.user?.role !== 'TAX_TECH') {
    return null;
  }

  return (
    <main style={{ padding: '1rem' }}>
      <h1>Admin Dashboard</h1>
      <div
        className="ag-theme-alpine"
        style={{ height: 500, width: '100%', marginBottom: '1rem' }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          onGridReady={onGridReady}
          defaultColDef={{ flex: 1, resizable: true, editable: true }}
          rowSelection="multiple"
          animateRows={true}
        />
      </div>
      <div className="flex justify-center text-md mt-2">
        <UIButton onClick={onConfirmChanges} type="button" text="Confirm Changes" />
      </div>
    </main>
  );
}
