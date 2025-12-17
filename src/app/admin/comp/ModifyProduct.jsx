"use client"
import { useContext, useEffect, useRef, useState } from "react";
import { Col, FormCheck, FormControl, FormGroup, FormLabel, FormSelect, InputGroup, Row, Table } from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { MdDeleteForever } from "react-icons/md";
import { FaYoutube } from "react-icons/fa6";
import { LuClipboardCopy } from "react-icons/lu";
import { PiCurrencyInrBold } from "react-icons/pi";
import { TbMoneybag } from "react-icons/tb";
import { post, put, remove } from "../../../../lib/apiClient";
import { UserContext } from "../../../../components/LayoutUI";

    const emptyForm = {  
        prdId : 0,              
        name : '',
        brandId : 0,
        categoryId : 0,
        subCategoryId : 0,
        desc : '',
        images : [''],
        ytRef : '',
        stock : 0,
        price : 0
    };

    const emptyFilter = {
        name : '',
        categoryId : [],
        subCategoryId : [],
        priceLimit : {
            min : '',
            max : ''
        }
    }

export default function EditSellerProducts() {

    const [form,setForm] = useState(emptyForm) // Editing specific product from filtered products
    
    const [filter,setFilter] = useState(emptyFilter);

    
    const [isEditMode, setIsEditMode] = useState(false); // manages whether to show edit form ot not..
    const [filtered_prd,setFiltered_prd] = useState([]); // response from server -> filtered products

    const {categories,user} = useContext(UserContext);

    const handleFilter = (e) => {
        const {name,value} = e.target;
        if(name === 'product-name') setFilter(p => ({...p,name : value}))
        else setFilter(p => ({
            ...p,
            priceLimit: {
                ...p.priceLimit,
                [name]: value === '' ? null : Number(value)
            }
        }));

    }

    console.log(filtered_prd);

    const handleCategory = (e) => {
        const {name} = e.target;
        const value = Number(e.target.value);

        if(filter?.[name].includes(value)) setFilter(p => ({...p,[name]:[...p?.[name].filter(f => f !== value)]})) //p?.[name].filter(f=> f !== value))
        else setFilter(p => ({...p,[name]:[...p?.[name],value]}))
    }

    const getSubCategory = (id) => {
        const subCat = categories?.categories?.find(
        c => c?.cat_id === id)?.sub_cat || [];
        return subCat;
    }
    const formSubCat = getSubCategory(form.categoryId);

    const handleSearch = async () => {

        const res = await post('/f',filter);

        if(res.status === 200){
            setFiltered_prd(res.data)
            setFilter(emptyFilter);
        }else console.error(res.data || 'Error while filtering products');
        setFilter(emptyFilter)
    }

    const handleCatSelectAll = () => {

        if(!isAllCatSelected)setFilter(p => ({...p,categoryId:categories.categories.map(c => c.cat_id)}))
        else setFilter(p => ({...p,categoryId:[]}))
    }

    const handleSubSelectAll = () => {
        console.log(availableSubCategories,'jn');
        if(!isAllSubCatSelected)setFilter(p => ({...p,subCategoryId:[...availableSubCategories.map(c => c.sub_cat_id)]}))
        else setFilter(p => ({...p,subCategoryId:[]}))
    }

    const availableSubCategories = categories?.categories
    ?.filter((cat) => filter?.categoryId?.includes(cat.cat_id))
    ?.flatMap((cat) => cat?.sub_cat);

    useEffect(() => {
    setFilter((p) => ({
        ...p,
        subCategoryId : p.subCategoryId.filter((subId) =>
        availableSubCategories.some((s) => s.sub_cat_id === subId) // .some returns true or false with any one value
        )
    }));
    }, [filter.categoryId]);

    const isAllCatSelected = filter?.categoryId?.length === categories?.categories?.map(c=>c.cat_id).length
    const isAllSubCatSelected = filter?.subCategoryId?.length === availableSubCategories?.length


    const handleDisable = async (id) => {
        try{
            if(confirm("The Product will be permanently deleted.. proceed?")){
                const res = await remove(`admin/product/delete/${id}`);
                if(res.status !== 200) return alert("Product Deletion failed");
                setFiltered_prd(prev =>
                    prev
                        .map(group => ({
                            ...group,
                            products: group.products.filter(
                                p => p.productId !== id
                            )
                        }))
                        .filter(group => group.products.length > 0)
                );
            }
        }catch(er){
            console.error('Deletion of product failed : ',er);
        }
    };

    const showEdit = (val) => {
        setIsEditMode(true);
        setForm(val);
    };

    const hideEdit = () => {
        setIsEditMode(false);
        setForm(emptyForm);
    };

    const saveProduct = async () => {
        const res = await put(`admin/product/modify?id=${Number(form.productId)}`,form);
        if(res?.status === 200){
            setFiltered_prd((pre) => 
                pre.map(pr => ({...pr,products : [...pr.products.map(p => p.productId === form.productId ? form : p)]}))
            )
            hideEdit();
        }
    };

    const [error, seterror] = useState('');
    const inputRefs = useRef([]);
    const [newInputIndex, setNewInputIndex] = useState(null);

    const handleForm = (n,v) => { // name and value [key - value]
        setForm((p)=>({...p,[n]:v}));
    }

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

    const handleDelete = (id) => {
        if (form.images.length > 1) {
            setForm(p => ({
                ...p,
                images: p.images.filter((_, i) => i !== id)
            }));
        } else {
            seterror('At least one image is required');
            setTimeout(() => seterror(''), 3000);
        }
    };

    const handlePaste = async () => {
        try {
            const clipText = await navigator.clipboard.readText();
            const newUrl = new URL(clipText);
            const videoCode = newUrl.searchParams.get("v");
            setForm(p =>({...p,['ytRef']: videoCode}))
        } catch (err) {
            alert("Invalid Url:", err);
        }
    };

    useEffect(() => {
    if (newInputIndex !== null && inputRefs.current[newInputIndex]) {
      inputRefs.current[newInputIndex].focus();
      setNewInputIndex(null);
    }
    }, [newInputIndex]);

    return (<>

        <div className="p-3 overflow-scroll overflow-x-hidden hide-scrollbar" style={{width:"100%",maxHeight:"calc(100vh - 7.8vh)"}}>
            
            <div className={isEditMode ? 'd-none hide-scrollbar' : 'hide-scrollbar'}>
                <div className="hide-scrollbar">
                    <div>   {/* Filter options */}
                        <div className='d-flex'>
                            <h3 className='m-3' style={{ fontFamily: "marcellus",fontWeight: "normal"}}>Filter Options</h3>
                            <div className='m-3 ms-auto me-5'>
                                <a className='btn btn-primary' onClick={()=>handleSearch()}>Search</a>
                            </div>
                        </div>
                        <div className='mx-3 mx-md-5 justify-content-center border-secondary p-4 rounded-2' style={{width:"95%",border:"1px solid"}}>
                        <form>
                            <div>
                            <FormGroup>
                                <div>
                                <label htmlFor="product-name" className='fs-5 fw-medium mb-2'>Product Name</label>
                                <FormControl placeholder='Enter Product Name' name='product-name' id='product-name' onChange={handleFilter} value={filter.name} />
                                </div>

                                <div className='mt-4'>
                                <div className='d-flex'>
                                    <label htmlFor="category-all" className='fs-5 fw-medium'>Category</label>
                                    <div className='ms-auto me-2'>
                                    <FormCheck type="switch" id='category-all' label="Select all" checked={isAllCatSelected} onChange={handleCatSelectAll} />
                                    </div>
                                </div>
                                <div id='category-aria' className='mt-2'>
                                    <Row>
                                    {
                                    categories?.categories?.map((c,i)=>
                                        <Col xs={12} md={6} lg={3} key={i} className='overflow-hidden'>
                                        <FormCheck id='category' type="checkbox" checked={filter?.categoryId?.includes(c.cat_id)} onChange={handleCategory} name='categoryId' value={c.cat_id} label={c.cat_name} />
                                        </Col>
                                    )
                                    } 
                                    </Row>
                                </div>
                                </div>

                                <div className='mt-4'>
                                <div className='d-flex'>
                                    <label htmlFor="sub-category-all" className='fs-5 fw-medium'>Sub Category</label>
                                    <div className='ms-auto me-2'>
                                    <FormCheck type="switch" id='sub-category-all' label="Select all" checked={isAllSubCatSelected} disabled={availableSubCategories?.length === 0} onChange={handleSubSelectAll} />
                                    </div>
                                </div>
                                <div id='sub-category-aria' className='mt-2'>
                                    <Row>
                                    { availableSubCategories?.length >= 1
                                        ?
                                    (availableSubCategories?.map((sub,i) => (
                                        <Col xs={12} md={6} lg={3} key={i}>
                                            <FormCheck key={i} type="checkbox" label={sub.sub_cat_name} name="subCategoryId"
                                            value={sub.sub_cat_id} checked={filter?.subCategoryId?.includes(sub.sub_cat_id)} onChange={handleCategory}
                                            />
                                        </Col>
                                        )))
                                        :
                                    <div className='w-100 justify-content-center d-flex p-4 text-secondary'> Select Category </div>}   
                                    </Row>
                                </div>
                                </div>

                                <div>
                                <label htmlFor="Amount" className='fs-5 fw-medium'>Price</label>
                                <div className='d-flex gap-4 mt-2'>
                                    <FormControl placeholder='Minimum amount' value={filter?.priceLimit?.min} name='min' onChange={handleFilter} className='w-25' />
                                    <FormControl placeholder='Maximum amount' value={filter?.priceLimit?.max} name='max' onChange={handleFilter} className='w-25' />
                                </div>
                                </div>
                            </FormGroup>
                            </div>
                        </form>
                        </div>
                    </div>
                </div>

                { filtered_prd?.length === 0 ? 

                <div className="w-auto text-center mt-5">
                    <h6>No Data</h6>
                </div>
                :
                <div className="mt-3">
                    <Table striped bordered className="rounded-3 overflow-hidden">
                        <thead>
                            <tr className="text-center">
                                <th>No.</th>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Sub Category</th>
                                <th>Selling Price(INR)</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filtered_prd.map(p => p.products?.map(
                                (val,ind)=> {
                                    const cat = categories?.categories?.find(c => c?.cat_id === val?.categoryId );
                                    const subCat = cat?.sub_cat?.find(s=>s?.sub_cat_id === val?.subCategoryId);
                                    return (
                                    <tr key={ind} className="text-center">
                                        <td>{ind+1}</td>
                                        <td>{val.name}</td>
                                        <td>{cat?.cat_name}</td>
                                        <td>{subCat?.sub_cat_name}</td>
                                        <td>₹ {val.price}</td>
                                        <td className="d-flex gap-2 justify-content-center">
                                            <a className="btn btn-success" onClick={()=> showEdit(val)}>Edit</a>
                                            <a className={user.role === "ADMIN" ? "btn btn-danger col-5" : "btn btn-secondary disabled col-5"} onClick={()=> handleDisable(val.productId)}>{"Delete"} </a>
                                        </td>
                                    </tr> )}
                                )
                            )}
                        </tbody>
                    </Table>
                </div>}
            </div>

            <span className={isEditMode ? 'd-block' : 'd-none'} >        {/* Show only if isEditMode is true */}
                <div className={"d-flex"}>
                    <h2 style={{ fontFamily: "marcellus",fontWeight: "normal"}} id="edit">Edit Your Product</h2>
                    <button className="btn btn-primary ms-auto me-5" onClick={()=>saveProduct(form)}>Save Product</button>
                </div>

                <div className="m-1 w-auto">
                    <div className=" gap-3 d-flex flex-column fw-medium fs-5">
                        <FormGroup>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl placeholder="Product Name" name="name" value={form.name} onChange={(e)=>handleForm(e.target.name,e.target.value)} minLength={2} />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>Brand</FormLabel>
                            <FormSelect name="brandId" value={form.brandId ?? ''} onChange={(e)=>handleForm(e.target.name,Number(e.target.value))}>
                                <option value={0} disabled>Select Category</option>
                                {categories?.brands?.map((br,i)=>
                                    <option key={i} value={br.id}>{br.name}</option>
                                )}
                            </FormSelect>
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>Category</FormLabel>
                            <FormSelect name="categoryId" value={form.categoryId ?? ''} onChange={(e)=>handleForm(e.target.name,Number(e.target.value))}>
                                <option value={0} disabled>Select Category</option>
                                {categories?.categories?.map((c,i)=>
                                    <option key={i} value={c.cat_id}>{c.cat_name}</option>
                                )}
                            </FormSelect>
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>Sub Category</FormLabel>
                            <FormSelect name="subCategoryId" value={form.subCategoryId === 0 ? '' : form.subCategoryId} onChange={(e)=>handleForm(e.target.name,Number(e.target.value))}>
                                <option value={0} disabled>Select sub category</option>
                                {formSubCat.map((subc,i)=>
                                    <option key={i} value={subc.sub_cat_id}>{subc.sub_cat_name}</option>
                                )}
                            </FormSelect>
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>Description</FormLabel>
                            <FormControl as={"textarea"} placeholder="Product Description" name="desc" value={form.desc} onChange={(e)=>handleForm(e.target.name,e.target.value)} maxLength={200} />
                        </FormGroup>

                        <FormGroup>
                            <FormLabel>Price</FormLabel>
                            <div className="d-flex justify-content-between gap-2">
                                <div className="w-50">
                                    <InputGroup>
                                        <InputGroupText><PiCurrencyInrBold /></InputGroupText>
                                        <FormControl placeholder="Minimum price" required value={form.price == 0 ? '' : form.price} name="price" min={1} onChange={(e)=>handleForm(e.target.name,Number(e.target.value))} />
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
                                        <FormControl placeholder="Available stock" required value={form.stock == 0 ? '' : form.stock} name="stock" min={0} onChange={(e)=>handleForm(e.target.name,Number(e.target.value))} />
                                    </InputGroup>
                                </div>
                            </div>
                        </FormGroup>

                        <FormGroup>
                            <div className="d-flex">
                                <FormLabel>Product Image</FormLabel>
                                <div className="px-2 py-0 btn btn-success ms-auto m-2 d-flex" style={{paddingBottom:"200px",height:"29px"}} onClick={handleAdd}>+</div>
                            </div>
                            {error && <div className="fs-6 text-danger fw-normal">{error}</div>}
                            {form?.images?.map((img,ind) =>
                                (
                                    <div key={ind} className="d-flex my-2">
                                        <InputGroup>
                                            <FormControl ref={(ele) => (inputRefs.current[ind] = ele)} type="text" value={img} placeholder="URL of the image" onChange={(e)=> handleRefImg(ind,e.target.value)} />
                                            <InputGroup.Text style={{color:"red",fontSize:"18px",cursor:"pointer"}}><span onClick={()=>{handleDelete(ind)}}><MdDeleteForever /></span></InputGroup.Text>
                                        </InputGroup>
                                    </div>    
                                )
                            )}
                        </FormGroup>

                        <FormGroup>
                            <div className="d-flex justify-content-lg-between m-2">
                                <FormLabel>Youtube Video Reference</FormLabel>
                                <a className="btn btn-primary" onClick={()=>setForm(p=>({...p,['ytRef']:''}))}>Clear</a>
                            </div>
                            <InputGroup>
                                <InputGroupText><FaYoutube /></InputGroupText>
                                <InputGroupText>www.youtube.com/watch?v=</InputGroupText>
                                <FormControl placeholder="Paste Youtube video link" name="ytRef" value={form.ytRef} readOnly />
                                <InputGroupText style={{cursor:'pointer'}} onClick={handlePaste}><LuClipboardCopy /></InputGroupText>
                            </InputGroup>
                        </FormGroup>

                    </div>
                </div>
            </span>
        </div>
    </>);
}