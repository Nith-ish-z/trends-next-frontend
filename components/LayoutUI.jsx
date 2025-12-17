"use client"

import NavReact from "./NavReact"
import CartManager from "./Cart"
import WishListManager from "./WishList"
import { useState,createContext, useEffect } from "react"
import Account from "./Account"
import { get, getUser } from "../lib/apiClient"

export const UserContext = createContext();

export default function LayoutUI({children}){

    const [showCart,setShowCart] = useState(false);
    const [showWish,setShowWish] = useState(false);
    const [showAccount,setShowAccount] = useState(false);
    const [search,setSearch] = useState('');
    const [searchNow,setSearchNow] = useState(false);
    const [user,setUser] = useState({role:"ADMIN"});

    const [categories,setCategories] = useState({});

    const loadUser = async () => {
        const res = await getUser();
        if(res.status === 200) setUser(res?.data)
            else console.error( res.data || 'Error while fetching user data : ',res?.error);
    }

    const loadCategories = async () =>{
        const res = await get("product/categories");
        if(res?.status === 200) setCategories(res?.data)
            else console.error( res?.data || "Error while loading categories info")
    }

    useEffect(
      ()=>{
          loadUser();
          loadCategories();
      },[]
    );

    return (
        <UserContext.Provider value = {{user,setUser,categories,setCategories,search,setSearch,searchNow,setSearchNow}}>
            <header className="sticky-top">
                <NavReact showWish = {setShowWish} showCart = {setShowCart} showAccount = {setShowAccount} />
            </header>
            <CartManager show={showCart} hideCanvas={setShowCart} />
            <WishListManager show={showWish} hideCanvas={setShowWish} />
            <Account show={showAccount} hideAccount={setShowAccount} />
            {children}
        </UserContext.Provider>
    )
}