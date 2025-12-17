"use client";

import { useEffect, useState } from "react";
import { get, put, remove } from "../../../../lib/apiClient";
import { Button, FormControl, FormSelect, Table } from "react-bootstrap";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("ALL");
  const [limit, setLimit] = useState(10);

  const loadUsers = async () => {
    const res = await get("/admin/users", {
      params: { role, limit }
    });
    setUsers(res.data.content);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const changeRole = async (userId, role) => {
    await put("/admin/users/role", { userId, role });
    loadUsers();
  };

  const deleteUser = async (userId) => {
    if (!confirm("Delete user permanently?")) return;
    await remove(`/admin/users/${userId}`);
    loadUsers();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold m-3" style={{ fontFamily: "marcellus",fontWeight: "normal"}}>User Management</h2>

                                                {/* FILTER */}
      <div className="flex gap-4 m-4">
        <FormSelect value={role} onChange={e => setRole(e.target.value)}>
          <option>ALL</option>
          <option>MEMBER</option>
          <option>MANAGER</option>
          <option>ADMIN</option>
        </FormSelect>

        <div className="d-flex justify-content-between">
          <FormControl type="number" value={limit} className="mt-3 w-50" onChange={e => setLimit(e.target.value)} placeholder="Limit"/>
          <div className="mt-3 h-100">
            <Button onClick={loadUsers}>Submit</Button>
          </div>
        </div>
      </div>

                                  {/* TABLE */}
      <div className="m-2">
        <Table className="w-full border">
        <thead>
          <tr>
            <th>No</th>
            <th>UserName</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>DOB</th>
            <th>Role</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u, i) => (
            <tr key={u.id}>
              <td>{i + 1}</td>
              <td>{u.userName}</td>
              <td>{u.fullName}</td>
              <td>{u.email}</td>
              <td>{u.num}</td>
              <td>{u.dob}</td>
              <td>
                <select
                  value={u.role}
                  onChange={e => changeRole(u.id, e.target.value)}
                >
                  <option>MEMBER</option>
                  <option>MANAGER</option>
                  <option>ADMIN</option>
                </select>
              </td>
              <td>
                <button className="btn-danger" onClick={() => deleteUser(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
      </div>
  );
}
