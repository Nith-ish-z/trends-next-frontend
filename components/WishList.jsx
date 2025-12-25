import { useContext, useState } from "react";
import { Card, CardBody, Offcanvas, OffcanvasBody, OffcanvasHeader, OffcanvasTitle } from "react-bootstrap";
import { UserContext } from "./LayoutUI";
import { MdOutlineCancel } from "react-icons/md";
import { post, put, remove } from "../lib/apiClient";

export default function WishListManager({show,hideCanvas}){

    const {user,setUser} = useContext(UserContext);

    const handleDeleteWish = async (id) => {
        const res = await remove(`wishlist/remove?productId=${id}`);
        if(res.status === 200)
            setUser(p => ({
                ...p,
                wishItem: p.wishItem.filter(w => w.productId !== id)
            }));
            else console.error("Error while removing product from wishlist");
    };

    const handleMoveToCart = async (prd) => {
        const res = await post(`cart/${prd.productId}`);

        if (res.status !== 201) {
            console.error(res.data || 'Failed to add product');
            return;
        }

        setUser(prev => {

            if (prev.cartItem.some(item => item.productId === prd.productId)){
                return {
                    ...prev,
                    cartItem : [...prev.cartItem.map(c => c.productId === prd.productId ? ({...c,count:c.count+1}) : ({...c}))]
                };
            }else

            return {
                    ...prev,
                    cartItem : [...prev.cartItem,{
                        productId : prd.productId,
                        name : prd.name,
                        subCategory : prd.subCategory,
                        count : 1,
                        price : prd.price,
                        url : 	prd.url
                    }]
                };
        });

        setUser(p=> ({...p,wishItem:[...p.wishItem.filter(w=> w.productId !== prd.productId)]}));
    };

    return <>
        <Offcanvas show={show} onHide={()=>hideCanvas(false)} placement="end" >
            <OffcanvasHeader closeButton>
                <OffcanvasTitle>WishList Items</OffcanvasTitle>
            </OffcanvasHeader>
            <OffcanvasBody>
                {user?.wishItem?.length === 0 
                ? 
                <div className="w-100 h-100 align-items-center d-flex justify-content-center h4">
                    No Data
                </div>
                :
                    <div className=" overflow-scroll hide-scrollbar">
                        {user?.wishItem?.map(
                            (w,i) => 

                            <div key={i} className="my-1">
                                <Card className="">
                                    <CardBody className="d-inline-bloc position-relative"> {/*  Cancel Button  */}
                                        <div onClick={()=>handleDeleteWish(w.productId)} style={{position: 'absolute',top: '1px',right: '1px',display: 'flex',gap: '0px',zIndex: 10}} >
                                            <div className='px-1 py-0 btn border-0'>
                                                <MdOutlineCancel className="fs-3" color="red" />
                                            </div>
                                        </div>

                                        <div className="d-flex">
                                            <div>
                                                <div className="rounded-circle overflow-hidden" style={{height:"65px",width:"65px"}}>
                                                <img src={w.url[0]} alt="product-img" className="w-100 h-100" />
                                            </div>
                                            </div>

                                            <div className="ms-2 w-100">
                                                <div className="overflow-hidden d-flex"
                                                    style={{maxHeight:"60px",maxWidth:"280px"}}><h5>{w.name}</h5>
                                                </div>

                                                <div className="d-flex justify-content-between pe-3" >
                                                    <div className="overflow-hidden fst-italic" style={{maxHeight:'30px',maxWidth:"160px"}}>{w.subCategory}</div>
                                                    <div><span className="px-1">₹</span>{w.price.toLocaleString('en-IN')}</div>
                                                </div>

                                                <div className="d-flex">

                                                    <div className="ms-auto" onClick={()=>handleMoveToCart(w)}>
                                                        <a className="btn btn-primary">Add to cart</a>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        
                                    </CardBody>
                                </Card>
                            </div>
                        )}
                    </div>
                }
            </OffcanvasBody>
        </Offcanvas>
    </>
}
