"use client"

import { useContext, useState } from "react";
import { FormControl, FormGroup, FormLabel, FormSelect, InputGroup} from "react-bootstrap";
import { post } from "../../../../lib/apiClient";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { IoImage } from "react-icons/io5";
import { LuClipboardCopy } from "react-icons/lu";
import { UserContext } from "../../../../components/LayoutUI";

export default function AddCategory() {

    const {categories} = useContext(UserContext);

    const category = categories?.categories?.map(cat => ({cat_name : cat.cat_name,cat_id : cat.cat_id}))

    const emptyCat = {
        catName : '',
        desc : '',
        logoUrl : ''
    };
    const emptySubCat = {
        catId : 0,
        subCat : '',
        desc : '',
        logoUrl : ''
    };
    const [newCat,setNewCat] = useState(emptyCat);

    const [newSubCat,setNewSubCat] = useState(emptySubCat);

    const handleCat = (e) => {
        const {name,value} = e.target;
        setNewCat((pre)=>({...pre,[name] : value}));
    };

    const handleSubCat= (e) => {
        const {name,value} = e.target;
        if(name === 'catId') setNewSubCat((pre) => ({...pre,[name] : Number(value)}))
            else setNewSubCat((pre) => ({...pre,[name] : value}))
    };

    const handlePasteCat = async () => {
        try {
            const clipText = await navigator.clipboard.readText();
            setNewCat(p =>({...p,['logoUrl']: clipText}))
        } catch (err) {
            console.error("Clipboard error:", err);
        }
    };

    const handlePasteSubCat = async () => {
        try {
            const clipText = await navigator.clipboard.readText();
            setNewSubCat(p =>({...p,['logoUrl']: clipText}))
        } catch (err) {
            console.error("Clipboard error:", err);
        }
    };

    const handleSubmitCat = async (e) => {
        e.preventDefault();
        const res = await post('admin/create/category',newCat);
        if(res.status === 200){
            const text = "Category of "+"'"+res.data.name + "'" +" created successfully";
            alert(text);
        }else{
            alert('Category creation failed!..')
        }
        setNewCat(emptyCat);
    };

    const handleSubmitSubCat = async (e) => {
        e.preventDefault();
        const res = await post('admin/create/subcategory',newSubCat);
        if(res.status === 200){
            alert('SubCategory of '+newSubCat.subCat +' ,created successfully!');
        }else{
            alert('Creation Sub category failed!..');
        }
        setNewSubCat(emptySubCat);
    };
    return (
        <div className="p-3 overflow-scroll overflow-x-hidden hide-scrollbar" style={{maxHeight:"91.1vh"}}>

            <form onSubmit={handleSubmitCat}>
                <div className="d-flex">
                    <h2 style={{ fontFamily: "marcellus",fontWeight: "normal"}}>Add Category</h2>
                    <button className="btn btn-primary ms-auto me-5 " type="submit" >Add Category</button>
                </div>

                <div className="m-4 w-auto">
                    <div className="gap-3 d-flex flex-column fw-medium fs-5">
                        <div>
                            <FormGroup>
                                <FormLabel>
                                    Category name
                                </FormLabel>
                                <FormControl name="catName" required value={newCat.catName} onChange={handleCat} placeholder="Category Name" />
                            </FormGroup>
                        </div>
                        <div>
                            <FormGroup>
                                <FormLabel>
                                    Description
                                </FormLabel>
                                <FormControl as={"textarea"} required name="desc" value={newCat.desc} onChange={handleCat} placeholder="Description" />
                            </FormGroup>
                        </div>
                        <div>
                            <FormGroup>
                                <div className="d-flex justify-content-between mb-1">
                                    <div>
                                        <FormLabel> Logo Url </FormLabel>
                                    </div>
                                    <div>
                                        <a className="btn btn-warning" onClick={()=>{setNewCat((p)=>({...p,['logoUrl']:''}))}}>Clear</a>
                                    </div>
                                </div>
                                <InputGroup>
                                    <InputGroupText> <IoImage /> </InputGroupText>
                                    <FormControl placeholder="Paste the Url Link" required value={newCat.logoUrl} name="logoUrl" onChange={()=>{}} />
                                    <InputGroupText onClick={handlePasteCat}> <LuClipboardCopy /> </InputGroupText>
                                </InputGroup>
                            </FormGroup>
                        </div>
                        
                    </div>
                </div>
            </form>

            <hr className=" mx-2" />

            <div className="d-flex">
                <h2 style={{ fontFamily: "marcellus",fontWeight: "normal"}}>Add Sub Category</h2>
                <button className="btn btn-primary ms-auto me-5 " onClick={handleSubmitSubCat}>Add Category</button>
            </div>

            <div className="m-4 w-auto">
                <div className="gap-3 d-flex flex-column fw-medium fs-5">
                    <div>
                        <FormGroup>
                            <FormLabel>
                                Category name
                            </FormLabel>
                            <FormSelect name="catId" value={newSubCat.catId} required onChange={handleSubCat} >
                                <option disabled value={0}>Select Category</option>
                                {category?.map((opt,i) =>
                                    <option key={i} value={opt.cat_id}>{opt.cat_name}</option>
                                )}
                            </FormSelect>
                        </FormGroup>
                    </div>
                    <div>
                        <FormGroup>
                            <FormLabel>
                                Sub Category Name
                            </FormLabel>
                            <FormControl placeholder="Sub Category Name" required name="subCat" value={newSubCat.subCat} onChange={handleSubCat} />
                        </FormGroup>
                    </div>
                    <div>
                        <FormGroup>
                            <FormLabel>
                                Description
                            </FormLabel>
                            <FormControl as={"textarea"} placeholder="About Brand" required name="desc" value={newSubCat.desc} onChange={handleSubCat} />
                        </FormGroup>
                    </div>
                    <div>
                            <FormGroup>
                                <div className="d-flex justify-content-between mb-1">
                                    <div>
                                        <FormLabel> Logo Url </FormLabel>
                                    </div>
                                    <div>
                                        <a className="btn btn-warning" onClick={()=>{setNewSubCat((p)=>({...p,['logoUrl']:''}))}}>Clear</a>
                                    </div>
                                </div>
                                <InputGroup>
                                    <InputGroupText> <IoImage /> </InputGroupText>
                                    <FormControl placeholder="Paste the Url Link" required value={newSubCat.logoUrl} name="logoUrl" onChange={()=>{}} />
                                    <InputGroupText onClick={handlePasteSubCat}> <LuClipboardCopy /> </InputGroupText>
                                </InputGroup>
                            </FormGroup>
                        </div>
                    
                </div>
            </div>
        </div>
    );
}