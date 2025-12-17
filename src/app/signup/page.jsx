"use client"
import { useRouter } from 'next/navigation';
import { useState,useEffect,useRef } from 'react';
import Form from 'react-bootstrap/Form';
import { post } from '../../../lib/apiClient';
import { FormControl, FormGroup, FormLabel } from 'react-bootstrap';

export default function SignUp(){

    const router = useRouter();
    const [pwd,setPwd] = useState("");
    const [isPwdMatch,setIsPwdMatch] = useState(false);
    const [isOtpSent,setIsOtpSent] = useState(false);

    const [formData,setFormData] = useState(
        {
            firstName : "",
            lastName : "",
            userName : "",
            pwd : "",
            dob : "",
            email : "",
            num : ""
        }
    );

    const regex = /[^0-9]/g;

    const Otplength=4
    const [otp, setOtp] = useState(new Array(Otplength).fill(""));
    const inputRefs = useRef([]);

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, [isOtpSent]);

    const handleChange = (index, e) => {
        const value = e.target.value;
        if (isNaN(value)) return;

        const newOtp = [...otp];

        // allow only one input
        newOtp[index] = value.substring(value.Otplength - 1);
        setOtp(newOtp);

        // Move to next input if current field is filled
        if (value && index < Otplength - 1 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
        }

        // submit trigger
        const combinedOtp = newOtp.join("");
        if (combinedOtp.length === Otplength) onOtpSubmit(combinedOtp);
    };

    const onOtpSubmit = async (newOtp) => {

        let finalOtp = {otp : newOtp}
        let {status,data} = await post('signup/verify',finalOtp);

        setIsOtpSent(false);
        console.log({code : status, responseForOtp : data});
        if(status === 200){
            alert('User Created Successfully');
            router.push('/login');
        }
        else{  
            alert('User Creation failed');
        }

    }

    const handleClick = (index) => {
        inputRefs.current[index].setSelectionRange(1, 1);

        // optional
        if (index > 0 && !otp[index - 1]) {
        inputRefs.current[otp.indexOf("")].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (
        e.key === "Backspace" &&
        !otp[index] &&
        index > 0 &&
        inputRefs.current[index - 1]
        ) {
        // Move focus to the previous input field on backspace
        inputRefs.current[index - 1].focus();
        }
    };

    async function handleSubmit(e) {
        e.preventDefault();
        try {  
            const {status,data} = await post('signup',formData);
            if(status === 202){
                alert(data);
                return;
            }
            else if(status === 200){
                dismandleForm();
                setIsOtpSent(true);
                return;
            }
            else{
                alert(data || "SignUp Failed");
            };
        } catch (err) {
            console.log('error:',err.message);
        }
    
    }

    const handleForm = (e)=>{

        if (e.target.name === "num") {
            const onlyNums = e.target.value.replace(regex, "");
            setFormData(prev => (
                {
                    ...prev,
                    [e.target.name]: onlyNums
                }
            ));
            return;
        }
    
        setFormData(pre => (

            {
                ...pre,
                [e.target.name] : e.target.value
            }
        ));

        if(e.target.name === 'pwd'){
            const password = pwd;

            if(password.slice(0,e.target.value.length) !== e.target.value){
                setIsPwdMatch(true);
            }
            else{
                setIsPwdMatch(false);
            }
        }
    };

    const dismandleForm = (e) => {
        setFormData({
            firstName : "",
            lastName : "",
            userName : "",
            pwd : "",
            dob : "",
            email : "",
            num : ""
        })
        setPwd("");
    };

    return (
        <div style={{justifyItems:'center',alignContent:"space-evenly",height:"91.3vh",width:"100%",backgroundColor:"pink"}}>
            
            <div className={ isOtpSent ? "d-none" : "bg-body-secondary rounded-3 p-2"} style={{height:'max-content',maxWidth:"750px",width:"90%",marginInline:"0px"}}>
                <h2>Create Account</h2>
                <Form style={{marginRight:'4vw',marginLeft:'2vw',height:"80%",alignContent:"space-around",border:"2px solid black",borderRadius:"25px",padding:"2%"}}>
                    <FormGroup className='my-2'>
                        <FormLabel>Full Name</FormLabel>
                        <div className='d-block d-sm-flex'>
                            <FormControl placeholder='First Name' required autoComplete='off' name='firstName' type='text' className='m-1' value={formData.firstName} onChange={handleForm} />
                            <FormControl placeholder='Last Name' required autoComplete='off' name='lastName' type='text' className='m-1' value={formData.lastName} onChange={handleForm} />
                        </div>
                    </FormGroup>

                    <FormGroup controlId="Form.ControlUName" className='my-2'>
                        <FormLabel>User Name</FormLabel>
                        <FormControl placeholder='User Name' required autoComplete='off' name='userName' type='text' className='m-1' value={formData.userName} onChange={handleForm} />
                    </FormGroup>

                    <FormGroup className='my-2'>
                        <FormLabel>Password</FormLabel>
                        
                        <div className='d-block d-sm-flex'>
                            <FormControl placeholder='Create new Password' required autoComplete='off' name='pwd' type='password' className='m-1' 
                            value={pwd} 
                            onChange={(e)=>{setPwd(e.target.value)}}
                            />
                            <FormControl placeholder='Re-enter Your Password' required autoComplete='off' name='pwd' type='password' className='m-1'
                            value={formData.pwd}
                            onChange={handleForm} />
                        </div>
                        {isPwdMatch? <p style={{color:"red"}}>Password Mismatch</p> : <></>}
                    </FormGroup>

                    <div className='d-block d-md-flex flex-md-row'>

                        <div className='w-100'>
                            <FormGroup controlId="Form.ControlDob" className='my-2'>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl type='date' name='dob' required autoComplete='off' className='m-1 w-50' value={formData.dob} onChange={handleForm} />
                        
                        </FormGroup>

                        <FormGroup controlId="Form.ControlEmail" className='my-2'>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl placeholder='Email' required autoComplete='off' name='email' type='email' className='m-1 w-75' value={formData.email} onChange={handleForm} />
                        </FormGroup>

                        <FormGroup controlId="Form.ControlPhone" className='my-2'>
                            <FormLabel>Mobile Number</FormLabel>
                            <FormControl placeholder='Enter Your mobile number' autoComplete='off' name='num' type='text' className='m-1 w-75' value={formData.num} onChange={handleForm} />
                        </FormGroup>
                        </div>

                        <div className='w-75 mt-auto d-flex d-md-block ms-auto'>
                            <button className='m-1 btn btn-danger w-100' type='button' onClick={dismandleForm} >Clear</button>
                            <button className='m-1 btn btn-success w-100'onClick={handleSubmit} type='submit'>Submit</button>
                        </div>

                    </div>  
                    
                </Form>
                <div className=' justify-content-evenly d-flex mt-2'>
                    <p>Already having account? <span><a href='/login'>login</a></span></p>
                </div>
            </div>

            <span className={ isOtpSent ? '' : 'd-none'}>
                <div className=' justify-content-center d-flex'>
                    <div className='w-auto justify-content-center'>
                        <h2>Enter Otp sent to Your mail</h2>
                        <div className='d-flex justify-content-center gap-3'>
                            {otp.map((value, index) => {
                                return (
                                    <input
                                        style={{width:'50px',height:'50px',fontSize:'30px'}}
                                        key={index}
                                        type="text"
                                        maxLength={1}
                                        ref={(input) => (inputRefs.current[index] = input)}
                                        value={value}
                                        onChange={(e) => handleChange(index, e)}
                                        onClick={() => handleClick(index)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </span>
        </ div>
    )
}