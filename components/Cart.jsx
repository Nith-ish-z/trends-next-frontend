import { useContext } from "react";
import { Card, CardBody, Offcanvas, OffcanvasBody, OffcanvasHeader, OffcanvasTitle } from "react-bootstrap";
import { UserContext } from "./LayoutUI";
import { MdOutlineCancel } from "react-icons/md";
import { remove } from "../lib/apiClient";

export default function CartManager({show,hideCanvas}){

    const {user,setUser} = useContext(UserContext);

    const deleteAll = async (id) => {
        console.log("ID:",id);
        const res = await remove(`cart/clear/${id}`);
        if(res.status === 200){
            setUser(p => ({...p,cartItem: [...p.cartItem.filter(p => p.productId !== id)]}));
        }
    }

    const lessCount = async (c) => {
        
        const res = await remove(`cart/${c.productId}`);
        if (res.status !== 200) return;

        const { productId, remainingCount } = res.data;

        setUser(prev => ({
            ...prev,
            cartItem:
            remainingCount === 0
                ? prev.cartItem.filter(item => item.productId !== productId)
                : prev.cartItem.map(item =>
                    item.productId === productId
                    ? { ...item, count: remainingCount }
                    : item
                )
        }));
    };

    
    return (
        <div>
            <Offcanvas show={show} onHide={()=>hideCanvas(false)} placement="end" >
                <OffcanvasHeader closeButton>
                    <OffcanvasTitle>Cart Items</OffcanvasTitle>
                </OffcanvasHeader>
                    <OffcanvasBody>
                        { user?.cartItem?.length === 0 
                            ? 
                            <div className="w-100 h-100 align-items-center d-flex justify-content-center h4">
                                No Data
                            </div>
                            :
                            <div className=" overflow-scroll hide-scrollbar">
                                {user?.cartItem?.map(
                                    (c,i) =>

                                    <div key={i} className="my-1">
                                        <Card className="">
                                            <CardBody className="d-inline-bloc position-relative">
                                                <div onClick={()=>deleteAll(c.productId)} style={{position: 'absolute',top: '1px',right: '1px',display: 'flex',gap: '0px',zIndex: 10}} >
                                                    <div className='px-1 py-0 btn border-0'>
                                                        <MdOutlineCancel className="fs-3" color="red" />
                                                    </div>
                                                </div>

                                                <div style={{position: 'absolute',top: '1px',left: '1px',display: 'flex',gap: '0px',zIndex: 10}} className={c.count > 1 ? "" : "d-none"} >
                                                    <div className='px-1 py-0 btn border-0 rounded-circle bg-secondary bg-opacity-25'style={{height:"25px",width:"25px"}}>
                                                        <div className="fw-medium" style={{fontSize:"11px",paddingTop:"3px"}}>*{c.count}</div>
                                                    </div>
                                                </div>

                                                <div className="d-flex">
                                                    <div>
                                                        <div className="rounded-circle overflow-hidden" style={{height:"65px",width:"65px"}}>
                                                        <img src={c.url.imageUrl} alt="product-img" className="w-100 h-100" />
                                                    </div>
                                                    </div>

                                                    <div className="ms-2 w-100">
                                                        <div className="overflow-hidden d-flex"
                                                            style={{maxHeight:"60px",maxWidth:"280px"}}><h5>{c.name}</h5>
                                                        </div>

                                                        <div className="d-flex justify-content-between pe-3" >
                                                            <div className="overflow-hidden fst-italic" style={{maxHeight:'30px',maxWidth:"160px"}}>{c.subCategory}</div>
                                                            <div><span className="px-1">₹</span>{Number(c.price).toLocaleString('en-IN')}</div>
                                                        </div>

                                                        <div className="d-flex justify-content-evenly">
                                                            <div onClick={()=>lessCount(c)}>
                                                                <a className="btn btn-danger">Less Count</a>
                                                            </div>

                                                            <div className="" onClick={()=>deleteAll(c.productId)}>
                                                                <a className="btn btn-primary">Proceed to Buy</a>
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
        </div>
    );
}
