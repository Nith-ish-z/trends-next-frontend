"use client"

import React, { useContext, useEffect, useState } from 'react';
import { post } from '../../../lib/apiClient';
import { Button, Card, CardBody, CardImg, CardSubtitle, CardText, CardTitle, Col, FormCheck, FormControl, FormGroup, InputGroup, Row } from 'react-bootstrap';
import { UserContext } from '../../../components/LayoutUI';
import { IoMdHeart,IoMdHeartEmpty } from "react-icons/io";
import "../style.css"

export default function FilterPage (){

  const {categories,setUser,user,search,setSearch,searchNow,setSearchNow} = useContext(UserContext);
  const emptyFilter = {
    name : '',
    categoryId : [],
    subCategoryId : [],
    priceLimit : {
      min : '',
      max : ''
    }
  }
  const [filter,setFilter] = useState(emptyFilter);

  const [response,setResponse] = useState([]);

  const availableSubCategories = categories?.categories
    ?.filter((cat) => filter?.categoryId?.includes(cat.cat_id))
    ?.flatMap((cat) => cat?.sub_cat);

  const isAllCatSelected = filter?.categoryId?.length === categories?.categories?.map(c=>c.cat_id).length
  const isAllSubCatSelected = filter?.subCategoryId?.length === availableSubCategories?.length

  useEffect(() => {
    setFilter((p) => ({
      ...p,
      subCategoryId : p.subCategoryId.filter((subId) =>
        availableSubCategories?.some((s) => s.sub_cat_id === subId) // .some returns true or false with any one value
      )
    }));
  }, [filter.categoryId]);

  useEffect(() => {
    if(!search) return;
    handleSearch(({...emptyFilter,name:search}));
    setSearch('');
  },[searchNow])

  const addToCart = async(prd) => {
    const res = await post('/addcart?id='+prd.productId);
    if (res.status === 200){
      alert('Product successfully added to your cart!');
      setUser(p => ({...p,cartItem: [...p.cartItem,{name : prd.name,productId : prd.productId,price : prd.price,category:prd.category,categoryId:prd.categoryId,url : prd.url}]}))
    }else console.error(res.data || 'Failed of Adding product into Cart')
  }

  const toggleWish = async(prd) => {

    if(!isInWishlist(prd.productId)){
      const res = await post('/addwish?id='+prd.productId)
      if(res.status === 200){
        setUser(p => ({...p,wishItem:[...p.wishItem,
          {
            name : prd.name,
            productId : prd.productId,
            price : prd.price,
            category:prd.category,
            categoryId:prd.categoryId,
            url : prd.url
          }]}))
      }else console.error("Error while adding new wishlist");
    }else{
      setUser(p => ({...p,wishItem:[...p.wishItem.filter(f => f.productId !== prd.productId)]}))
    }
  }

  const isInWishlist = (id) => {
    return user?.wishItem?.some(item => item?.productId === id);
  };


  const handleFilter = (e) => {
    const {name,value} = e.target;
    if(name === 'product-name') setFilter(p => ({...p,name : value}))
      else setFilter(p => ({...p,priceLimit: {...p.priceLimit,[name]: Number(value.replace(/[^\d]/g, ""))}}));
  }

  const handleCategory = (e) => {
    const {name} = e.target;
    const value = Number(e.target.value);

    if(filter?.[name].includes(value)) setFilter(p => ({...p,[name]:[...p?.[name].filter(f => f !== value)]})) //p?.[name].filter(f=> f !== value))
      else setFilter(p => ({...p,[name]:[...p?.[name],value]}))
  }

  const handleSearch = async (name) => {

    if (name){
      const res = await post('/f',{...emptyFilter,name : name.name});
      if(res.status === 200){
        setResponse(res.data);

        setSearch('');
        setSearchNow(false);
      }else console.error(res.data || 'Error while fetching product details')
    }else{
      const res = await post('/f',filter);
      if(res.status === 200){
        setResponse(res.data);
        setFilter({emptyFilter})
      }else console.error(res.data || 'Error while filtering products');
    }
    setFilter(emptyFilter)
  };

  const handleCatSelectAll = () => {

    if(!isAllCatSelected)setFilter(p => ({...p,categoryId:categories.categories.map(c => c.cat_id)}))
      else setFilter(p => ({...p,categoryId:[]}))
  }

  const handleSubSelectAll = () => {
    console.log(availableSubCategories,'jn');
    if(!isAllSubCatSelected)setFilter(p => ({...p,subCategoryId:[...availableSubCategories.map(c => c.sub_cat_id)]}))
      else setFilter(p => ({...p,subCategoryId:[]}))
  }


  return (
    <div>
      <div>   {/* Filter options */}
        <div className='d-flex'>
          <h3 className='m-3'>Filter Options</h3>
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

      <div>
        <div className='m-3 mt-4'>
          <h3>Filtered product</h3>
        </div>
        <div>
          <div className='m-3'>
            {response.map( (prd,i) =>
              <div className='my-3' key={i} style={{padding:"5px",border:"2px solid black",borderRadius:"15px"}}>

                <div className='m-2'>
                  <div className='d-flex'>
                    <p className='h3'>{prd.category}</p>
                    
                  </div>

                  <hr />

                  <div style={{display:"grid",gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",gap:"1em",width:"100%",alignContent:"center"}}>

                    {prd?.products?.map( (p,i) =>
                      <div key={i} style={{width:"100%", justifyItems:"center"}}>
                        <Col  className="" style={{height:'min-content',width:'min-content'}}>
                          <Card className='position-relative product-card' style={{width:'17rem',borderRadius:'5px'}}>
                            <div>
                              <CardImg variant='top' src={p?.images !== null ? p?.images[0] : null} alt='product'style={{height:"25vh",width:"100%"}} />
                              <div style={{position: 'absolute',top: '5px',right: '5px',display: 'flex',gap: '0px',zIndex: 10}} >
                                <Button className='px-1 py-0 pb-1 wish-btn' onClick={()=>toggleWish(p)}>
                                  {!isInWishlist(p?.productId) ? <IoMdHeartEmpty /> : <IoMdHeart color='red' /> }
                                </Button>
                              </div>
                            </div>

                            <CardBody className='p-1 m-1' style={{height:"14vh"}}>
                              <div className='m-0 d-inline'>
                                <div>
                                  <CardTitle className='mb-0 pb-0 overflow-hidden' style={{height:"25px"}}>{p.name}</CardTitle>
                                  <CardText className='m-0 p-0 mb-1 ms-auto overflow-hidden' style={{height:"25px"}}><span>[</span>{p.category}<span>]</span></CardText>
                                </div>
                      
                                <div className='d-flex my-1'>
                                  <div className='d-flex overflow-hidden bg-secondary bg-opacity-25 rounded-2' style={{width:"8vw"}}>
                                    <CardSubtitle className='ms-1 my-2'><span>₹</span>{p.price.toLocaleString("en-IN")}</CardSubtitle></div>
                                    <div className='ms-auto'>
                                      <a className='btn btn-primary' onClick={()=>addToCart(p)}>Add to Cart</a>
                                    </div>
                                </div>
                              </div>
                            </CardBody>
                          </Card>
                        </Col>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
