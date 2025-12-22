"use client"

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { FaSearch } from "react-icons/fa";
import { BsBagHeart } from "react-icons/bs";
import { MdShoppingCart } from "react-icons/md";
import avatar from "../src/assets/default_avatar.png"
import { useContext } from 'react';
import { Button, FormGroup } from 'react-bootstrap';
import Link from 'next/link.js';
import { UserContext } from './LayoutUI';
import { usePathname, useRouter } from 'next/navigation';
import "../src/app/style.css"

export default function NavReact({showCart,showWish,showAccount}){

    const {user,search,setSearch,setSearchNow} = useContext(UserContext);
    const router = useRouter();
    const pathname = usePathname();

    const handleSearch = () => {
        if (pathname === "/f") {
            setSearchNow(true);
        }else {
            router.push("/f");
        }
    };

    return <Navbar expand="md" className=' bg-success-subtle'>

        <Container fluid className='px-4'>
            <Navbar.Brand className='fs-3 fw-semibold'>
                TRENDS
            </Navbar.Brand>
            
            <Navbar.Collapse id='basic-navbar-nav' className=' justify-content-end'>
                <Nav className='fs-6'>
                    <div className={user?.role !== "ADMIN" ? "d-none" : "m-auto me-2"}>
                        <a className={ pathname === "/admin" ? "btn disabled btn-secondary" : 'btn btn-primary'} onClick={()=>{router.push("/admin")}}>Admin</a>
                    </div>
                    <div className='ms-auto d-md-flex pt-1 pe-2'>
                        <FormGroup className='d-flex' style={{height:"5vh"}}>
                            <input className='w-100 rounded-start-3' onChange={(e)=>{setSearch(e.target.value)}} value={search} style={{fontSize:"18px"}} maxLength={18} placeholder='Product name' />
                            <a className='btn btn-outline-primary' onClick={handleSearch} style={{borderRadius:"0px 10px 10px 0px"}}>
                                <FaSearch />
                            </a>
                        </FormGroup>
                        
                    </div>

                    <div className='justify-content-end ms-lg-5 gap-3 ms-auto d-flex px-2' > 

                        <div className='py-2'>      {/* == WISHLIST == */}
                            
                            <div className='position-relative d-inline-block pb-1'>
                                { user.role === "GUEST" ?
                                <BsBagHeart className='fs-2 btn-pointer text-secondary' onClick={()=>{}} /> :
                                    <BsBagHeart className='fs-2 btn-pointer' onClick={()=>showWish(true)} />}
                                {user?.wishItem?.length > 0 ?
                                    <div className={'position-absolute top-0 start-100 translate-middle bg-danger text-white rounded-circle d-flex justify-content-center align-items-center '}
                                        style={{
                                            width: "16px",
                                            height: "16px",
                                            fontSize: "9px",
                                        }}>
                                            <div style={{paddingTop: '0px'}}>{user?.wishItem?.length}</div>       
                                    </div> : <></>
                                }
                            </div>
                        </div>

                        <div className='py-2 px-1'>      {/* == CART ICON == */}
                            
                            <div className='position-relative d-inline-block' style={{marginTop:"2px"}}>
                                { user.role === "GUEST" ?
                                <MdShoppingCart className='fs-2 btn-pointer text-secondary' onClick={()=>{}} /> :
                                <MdShoppingCart className='fs-2 btn-pointer' onClick={()=>showCart(true)} />
                                }
                                {user?.cartItem?.length > 0 ?
                                    <div className={'position-absolute top-0 start-100 translate-middle bg-danger text-white rounded-circle d-flex justify-content-center align-items-center'}
                                        style={{
                                            width: "16px",
                                            height: "16px",
                                            fontSize: "9px",
                                        }}>
                                            <div style={{paddingTop: '1px'}}>{user?.cartItem?.length}</div>       
                                    </div> : <></>
                                }
                            </div>
                        </div>

                        {/* === ACCOUNT ICON === */}
                        <div className="btn p-1" style={{border:'none'}}>
                            {user?.role === "GUEST" ?
                                
                                <Link href='/login'>
                                    <div>
                                        <Button color='primary'>Login</Button>
                                    </div>
                                </Link>
                                
                                :

                                <div className='overflow-hidden d-flex' onClick={()=>showAccount(true)} style={{borderRadius:'50%'}}>
                                    <img src={user?.profileImg || avatar.src} alt='user-profile' 
                                        style={{width:'40px',height:"40px"}} />
                                </div>
                            }
                           
                        </div>
                    </div>
                </Nav>

            </Navbar.Collapse>
            <Navbar.Toggle aria-controls='basic-navbar-nav'className='col-0 p-0 ms-auto' />
        </Container>          
    </Navbar>
}
