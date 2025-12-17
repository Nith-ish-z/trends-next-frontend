"use client"
import { useEffect, useRef, useState } from "react";
import { FormControl, FormGroup, FormLabel, FormSelect, InputGroup } from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { MdDeleteForever } from "react-icons/md";
import { FaLink } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa6";
import { PiCurrencyInrBold } from "react-icons/pi";
import { LuClipboardCopy } from "react-icons/lu";
import { TbMoneybag } from "react-icons/tb";
import { post } from "../../../../lib/apiClient";

export default function AddProduct({prdData}) {

    const emptyForm = {
            name : "",
            brandId : 0,
            categoryId : 0,
            subCategoryId : 0,
            desc : "",
            images : [''],
            ytRef : '',
            stock : 0,
            price : 0
        }
    const [form,setForm] = useState(emptyForm);

    const subCat = prdData?.categories?.find((c) => c.cat_id === form.categoryId )?.sub_cat || [];

    const inputRefs = useRef([]);
    const [newInputIndex, setNewInputIndex] = useState(null);

    const handleForm = (e) => {

        var {name,value} = e.target;
        if(name === 'name' || name === 'desc' || name === 'ytRef') setForm((p)=> ({...p,[name]:value}))
            else {
                setForm((p)=> ({...p,[name]:Number(value.replace(/[^0-9]/g,''))}));
            }    
    };

    const handleRefImg = (ind,val) => {
        const prev = [...form.images];
        prev[ind] = val
        setForm((p)=> ({...p,['images']:prev}));
    };

    const handleAdd = () => {
        const newImg = [...form.images,''];
        setForm((p)=> ({...p,['images']:newImg}));
        setNewInputIndex(form.images.length);
    };

    const handleDelete = (ind) => {
        form.images.length > 1 ?
        setForm((p)=> ({...p,['images']: form.images.filter(( _,i) => i !== ind)}))
        : alert('Least one of input is needed')
    };

    const handlePaste = async () => {
        try {
            const clipText = await navigator.clipboard.readText();
            const newUrl = new URL(clipText);
            const videoCode = newUrl.searchParams.get("v");
            setForm(p =>({...p,'ytRef': videoCode}));
            console.log(form)
        } catch (err) {
            alert("Invalid Url:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(form !== emptyForm){
            const res = await post('/admin/create/product',form);
            if(res.status === 201){
                setForm(emptyForm);
                return alert('Product created successfully with product id "'+ res.data.productId+'"');
            };
        }else{
            return alert('Invalid Price Value');
        }
    };

    useEffect(() => {
    if (newInputIndex !== null && inputRefs.current[newInputIndex]) {
      inputRefs.current[newInputIndex].focus();
      setNewInputIndex(null);
    }
    }, [newInputIndex]);

    return (<>
        <div className="p-3 overflow-scroll overflow-x-hidden hide-scrollbar" style={{maxHeight:"91.1vh"}}>
            
            <form onSubmit={handleSubmit}>
                <div className="d-flex">
                    <h2 style={{ fontFamily: "marcellus",fontWeight: "normal"}}>Sell Your Product</h2>
                    <button className="btn btn-primary ms-auto me-5" type="submit">Add Product</button>
                </div>

                <div className="m-4 w-auto">
                    <div className=" gap-3 d-flex flex-column fw-medium fs-5">
                        <FormGroup>
                            <FormLabel className="">Product Name</FormLabel>
                            <FormControl placeholder="Product Name" name="name" required value={form.name} onChange={handleForm} minLength={2} />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>Brand</FormLabel>
                            <FormSelect name="brandId" value={form.brandId} required onChange={handleForm}>
                                <option disabled value={0}>Select Brand</option>
                                {prdData?.brands?.map((brand,i)=>
                                    <option key={i} value={brand.id}>{brand.name}</option>
                                )}
                            </FormSelect>
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>Category</FormLabel>
                            <FormSelect name="categoryId" value={form.categoryId} required onChange={handleForm}>
                                <option disabled value={0}>Select Category</option>
                                {prdData?.categories?.map((cat,i) =>
                                    <option key={i} value={cat.cat_id}>{cat.cat_name}</option>
                                )}
                            </FormSelect>
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>Sub Category</FormLabel>
                            <FormSelect name="subCategoryId" value={form.subCategoryId} required onChange={handleForm}>
                                <option disabled value={0}>Select sub category</option>
                                {subCat.map((s_cat,i)=>
                                    <option key={i} value={s_cat.sub_cat_id}>{s_cat.sub_cat_name}</option>
                                )}
                            </FormSelect>
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>Description</FormLabel>
                            <FormControl as={"textarea"} placeholder="Product Description" required name="desc" value={form.desc} onChange={handleForm} maxLength={200} />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>Price</FormLabel>
                            <div className="d-flex justify-content-between gap-2">
                                <div className="w-50">
                                    <InputGroup>
                                        <InputGroupText><PiCurrencyInrBold /></InputGroupText>
                                        <FormControl placeholder="Price" required value={form.price === 0 ? '' : form.price} name="price" min={1} onChange={handleForm} />
                                    </InputGroup>
                                </div>
                            
                            </div>
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>Stock</FormLabel>
                            <div className="d-flex justify-content-between gap-2">
                                <div className="w-25">
                                    <InputGroup>
                                        <InputGroupText><TbMoneybag /></InputGroupText>
                                        <FormControl placeholder="Available stock" required value={form.stock == 0 ? '' : form.stock} name="stock" min={0} onChange={handleForm} />
                                    </InputGroup>
                                </div>
                            </div>
                        </FormGroup>

                        <FormGroup>
                            <div className="d-flex">
                                <FormLabel>Product Image</FormLabel>
                                <div className="px-2 py-0 btn btn-success ms-auto m-2 d-flex" style={{paddingBottom:"200px",height:"29px"}} onClick={handleAdd}>+</div>
                            </div>
                            
                            {form.images.map((img,ind) =>
                                (
                                    <div key={ind} className="d-flex my-2">

                                        <InputGroup >
                                            <InputGroupText>
                                                <FaLink />
                                            </InputGroupText>

                                            <FormControl ref={(ele) => (inputRefs.current[ind] = ele)} required type="text" value={img} placeholder="URL of the image" onChange={(e)=> handleRefImg(ind,e.target.value)} />

                                            <InputGroupText style={{color:"red",fontSize:"18px",cursor:"pointer"}}>
                                                <span onClick={()=>{handleDelete(ind)}}>
                                                    <MdDeleteForever />
                                                </span>
                                            </InputGroupText>
                                        </InputGroup>
                                    </div>    
                                )
                            )}
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>Youtube Video Reference</FormLabel>
                            <InputGroup>
                                <InputGroupText><FaYoutube /></InputGroupText>
                                <InputGroupText>www.youtube.com/watch?v=</InputGroupText>
                                <FormControl placeholder="Paste Youtube video link" name="ytRef" value={form.ytRef} readOnly />
                                <InputGroupText style={{cursor:'pointer'}} onClick={handlePaste}><LuClipboardCopy /></InputGroupText>
                            </InputGroup>
                        </FormGroup>
                    </div>
                </div>
            </form>
        </div>
    </>);
}