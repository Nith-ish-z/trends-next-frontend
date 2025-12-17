"use client"

import { useState } from "react";
import { FormControl, FormGroup, FormLabel, InputGroup } from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { FaLink } from "react-icons/fa";
import { LuClipboardCopy } from "react-icons/lu";
import { post } from "../../../../lib/apiClient";

export default function AddBrand() {

    const emptyAddBrand = {
            name : '',
            desc : '',
            imgUrl : ''
        }
    const [addBrand,setAddBrand] = useState(
        emptyAddBrand
    );

    const handleAddBrandChange = (e) => {
        const {name,value} = e.target ;
        setAddBrand((pre) => ({...pre,[name] : value}));
    };

    const handlePaste = async (e) => {
        try {const clipText = await navigator.clipboard.readText();
            console.log(clipText);
            setAddBrand(p =>({...p,['imgUrl']: clipText}))
            
        } catch (err) {
            console.error("Clipboard error:", err);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await post('admin/create/brand',addBrand);
        if(res.status === 200){
            alert('Brand succesfully created with id ',res.data.id);
        }else{
            alert('Brand creation Failed !..')
        }
        console.log(addBrand);
        setAddBrand(emptyAddBrand);
    };
    return (
        <div className="p-3 overflow-scroll overflow-x-hidden hide-scrollbar" style={{maxHeight:"91.1vh"}}>
            <form onSubmit={handleSubmit}>
                <div className="d-flex">
                    <h2 style={{ fontFamily: "marcellus",fontWeight: "normal"}}>Add new Brand</h2>
                    <button className="btn btn-primary ms-auto me-5" type="submit">Add Brand</button>
                </div>

                <div className="m-4 w-auto">
                    <div className="gap-3 d-flex flex-column fw-medium fs-5">
                        <div>
                            <FormGroup>
                                <FormLabel>
                                    Brand name
                                </FormLabel>
                                <FormControl placeholder="Brand Name" name="name" required value={addBrand.name} onChange={handleAddBrandChange} />
                            </FormGroup>
                        </div>
                        <div>
                            <FormGroup>
                                <FormLabel>
                                    Description
                                </FormLabel>
                                <FormControl as={"textarea"} placeholder="About Brand" required name="desc" value={addBrand.desc} onChange={handleAddBrandChange} />
                            </FormGroup>
                        </div>
                        <div>
                            <FormGroup>
                                <FormLabel>
                                    Logo Url
                                </FormLabel>
                                <InputGroup>
                                    <InputGroupText> <FaLink /> </InputGroupText>
                                    <FormControl placeholder="Paste the Url Link" required value={addBrand.imgUrl} name="imgUrl" onChange={()=>{}} />
                                    <InputGroupText onClick={handlePaste}> <LuClipboardCopy /> </InputGroupText>
                                </InputGroup>
                            </FormGroup>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}