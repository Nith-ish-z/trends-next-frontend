"use client"

import React, { useState } from "react";
import { post } from "../../../lib/apiClient.js";
import { Form, FormControl, FormGroup, FormLabel } from "react-bootstrap";
import Link from "next/link.js";

const LoginPage = () => {

    const emptyForm = {
        uName : '', pwd : ''
    };
    const [form, setForm] = useState(emptyForm);

    const handleChange = (e) => {
        const {name,value} = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await post("/login", form);

            if (res.status === 200) {
                // redirect to homepage after login
                alert('Login successfully');
                window.location.href = "/";
            }else if(res.status === 202) alert(res.data.message);
                else {
                console.error(res?.data || "Some error occured");
            }
        } catch (err) {
            console.error(err);
        }
    };


  return (
    <>
        <div style={{justifyItems:'center',alignContent:"center",height:"100vh",width:"100%",backgroundColor:"pink"}}>
        <div className="bg-body-secondary rounded-3 p-2" style={{height:'60vh',maxWidth:"600px",width:"90%",marginInline:"0px"}}>

            <h2>Login</h2>
            <Form style={{marginRight:'4vw',marginLeft:'2vw',height:"80%",alignContent:"space-around"}}>
                
                <FormGroup controlId="Form.ControlFName" className='my-4'>
                    <FormLabel>User Name</FormLabel>
                    <FormControl placeholder='User Name' type='text' className='m-1' autoComplete={"false"} autoCorrect={"false"} onChange={handleChange} name="uName" value={form.uName} />
                </FormGroup>

                <FormGroup controlId="Form.ControlPwd" className='my-4'>
                    <FormLabel>Password</FormLabel>
                    <FormControl placeholder='Password' type='password' className='m-1' onChange={handleChange} name="pwd" value={form.pwd} />
                </FormGroup>

                <div className='mt-5 mb-3 justify-content-evenly gap-2 row'>
                    <button className='btn btn-danger col-5 justify-content-center' onClick={()=>{setForm(emptyForm)}}>Clear</button>
                    <button className='btn btn-success col-5 justify-content-center' type='submit' onClick={handleSubmit}>Submit</button>
                </div>

                <div className=' justify-content-center d-flex'><span className=" d-inline-flex">New user?<Link href='/signup' className="nav-link ps-2 text-primary">Create new Account</Link></span></div>

            </Form>
        </div>
        </ div></>
    )
};

export default LoginPage;