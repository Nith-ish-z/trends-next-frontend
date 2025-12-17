"use client";

import { useState } from "react";
import { post } from "../../../../lib/apiClient";
import { Button, FormControl, FormGroup, FormLabel, FormSelect } from "react-bootstrap";

export default function CreateUserPage() {

    const emptyForm = {
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        dob: "",
        mobile: "",
        password: "",
        role: "MEMBER"
    }
    const [form, setForm] = useState(emptyForm);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const submit = async () => {
        try {
        const res = await post("/admin/users", form);
        if(res.status === 200){
            setForm(p => emptyForm);
            alert("User successfully created");
            return;
        }
        } catch (err) {
        console.error(err?.response || err?.message || "Error while Creating user");
        alert(err.response?.data?.message|| res.data || "Error");
        }
    };

    return (
        <div className="p-6 max-w-xl mx-auto overflow-hidden hide-scrollbar">
        <h2 className="text-xl font-bold m-3" style={{ fontFamily: "marcellus",fontWeight: "normal"}}>Create New User</h2>

        <div className="p-4">
            <FormGroup>
                <div>
                    <FormLabel>First Name</FormLabel>
                    <FormControl placeholder="First Name" name="firstName" type="text" onChange={handleChange} value={form.firstName} />
                </div>

                <div>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl placeholder="Last Name" name="lastName" value={form.lastName} onChange={handleChange} />
                </div>

                <div>
                    <FormLabel>User Name</FormLabel>
                    <FormControl placeholder="User Name" name="username" value={form.username} onChange={handleChange} />
                </div>

                <div>
                    <FormLabel>Password</FormLabel>
                    <FormControl placeholder="Password" type="password" value={form.password} onChange={handleChange} />
                </div>

                <div>
                    <FormLabel>E Mail</FormLabel>
                    <FormControl placeholder="E mail" name="mail" type="" value={form.email} onChange={handleChange} />
                </div>

                <div>
                    <FormLabel>DOB</FormLabel>
                    <FormControl type="date" value={form.dob} name="dob" onChange={handleChange} />
                </div>

                <div>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl value={form.mobile} name="mobile" onChange={handleChange} placeholder="Mobile Number" />
                </div>

                <div className="mt-2">
                    <FormLabel>Role</FormLabel>
                    <FormSelect name="role" className="border p-2 w-full mb-3" onChange={handleChange}>
                        <option value="MEMBER">MEMBER</option>
                        <option value="MANAGER">MANAGER</option>
                        <option value="ADMIN">ADMIN</option>
                    </FormSelect>

                    <div className="d-flex">
                        <Button onClick={submit} className="ms-auto bg-black text-white px-4 py-2 rounded">
                            Create User
                        </Button>
                    </div>
                </div>
            </FormGroup>
        </div>

                    
        </div>
    );
}
