"use client"
import { Container} from "react-bootstrap";
import { useState,useContext } from "react";
import AddProduct from "./comp/AddProduct.jsx";
import EditSellerProducts from "./comp/ModifyProduct.jsx";
import AddBrand from "./comp/AddBrand.jsx";
import AddCategory from "./comp/AddCategory.jsx";
import { put,remove } from "../../../lib/apiClient.js";
import { UserContext } from "../../../components/LayoutUI.jsx";
import HomePageEdit from "./comp/HomePageEdit.jsx";
import AdminUsersPage from "./comp/AdminUsers.jsx";
import CreateUserPage from "./comp/CreateUser.jsx";

export default function SellerPage() {
    const [currentPage,setCurrentPage] = useState('add-prd');

    const {user,categories,setCategories} = useContext(UserContext);
    const userRole = user.role;


    const handleUpdate = async (type,id,newval) => {
        switch (type){
            case "category" :
                const resCategory = await put("admin/update/category?id="+id,newval);
                if(resCategory.status === 200) setCategories(p => ({...p,categories : p.categories.map(c => c.cat_id === id.catId ? {...c,...newval} : c)}))
                    else alert("Failure of Category Update : ",newval.cat_name)
                break;

            case "subCategory" :
                const {catId , subCatId} = id;
                const resSubCategory = await put("admin/update/subcategory?id="+subCatId,newval);
                if(resSubCategory.status === 200) setCategories(p => ({...p,categories : p.categories.map(c => c.cat_id === catId ? {...c,sub_cat : c.sub_cat.map(s => s.sub_cat_id === subCatId ? {...s,...newval} : s)} : c)}))
                    else alert("Failure of sub Category Update : ",newval.sub_cat_name)
                break;

            case "brand" :
                const resBrand = await put("admin/update/brand?id="+id,newval);
                if(resBrand.status === 200) setCategories(p => ({...p,brands : p.brands.map(b => b.id === id ? {...b,...newval} : b)}))
                    else alert("Failure of Brand update : ",newval.name);
                break;
        };

    };

    const handleDelete = async (type,id) => {
        switch (type) {

            case "category":
                const resCategory = await remove("admin/delete/category?id="+id);
                if(resCategory.status === 200) setCategories(p => ({...p,categories: p.categories.filter(c => c.cat_id !== id)}))
                    else alert("Deletion of category failed");
                break;

            case "subCategory":
                const {catId,subCatId} = id;
                const resSubCategory = await remove("admin/delete/subcategory?id="+subCatId);
                if(resSubCategory.status === 200) setCategories(p => ({...p,categories: p.categories.map(c => c.catId === catId ? { ...c, sub_cat : c.sub_cat.filter(s => s.sub_cat_id !== subCatId)} :c )}))
                    else alert("Deletion of sub category failed");
                break;

            case "brand":
                const resBrand = await remove("admin/delete/brand?id=",id);
                if(resBrand.status === 200) setCategories(p => ({...p,brand : p.brands.filter(b => b.id !== id)}))
                    else alert("Deletion of brand failed");
                break;

            default:
                return p;
        }
    };
    const nav = [
        {
            value : "add-prd",
            page : "Add Product",
            as : false // admin specific 
        },
        {
            value : "add-brand",
            page : "Add Brand",
            as : false
        },
        {
            value : "add-cat",
            page : "Add Category",
            as : false
        },
        {
            value : "edt-prd",
            page : "Modify Product",
            as : true
        },
        {
            value : "home-page",
            page : "Home View",
            as : true
        },
        {
            value : "add-user",
            page : "Create User",
            as : true
        },
        {
            value : "alt-user",
            page : "Edit Users",
            as : true
        }
    ];
    return (<>
    <div className="hide-scrollbar">
        
        <div style={{backgroundColor:"rgba(211, 211, 211, 0.950)",height:"91.1vh"}}> {/*Body Part*/}
            <div className="d-flex overflow-hidden">
                <div className="p-0 bg-light bg-opacity-75 position-sticky" style={{width:"28vw",height:"91.1vh",flex:1}}>       {/*Left side navigation*/}
                    <Container className="p-0">
                        <ul className="list-unstyled m-0">
                            <div>
 
                            {nav.map(
                                (navi,i) =>
                                {
                                    if(userRole === "MEMBER" && !navi.as){
                                        return <li key={i} className="p-3 fs-4 btn w-100 text-start ps-5" id="nav-optn" style= {{backgroundColor : (currentPage === navi.value?  "rgb(255, 225, 19)":null)}} onClick={()=>{setCurrentPage(navi.value)}}>{navi.page}</li>
                                    }else if(userRole !== "MEMBER" ){
                                        return <li key={i} className="p-3 fs-4 btn w-100 text-start ps-5" id="nav-optn" style= {{backgroundColor : (currentPage === navi.value?  "rgb(255, 225, 19)":null)}} onClick={()=>{setCurrentPage(navi.value)}}>{navi.page}</li>
                                    }else{
                                        return <li key={i} className="p-3 fs-4 btn w-100 text-start ps-5 text-secondary" id="nav-optn" style= {{backgroundColor : (currentPage === navi.value?  "rgb(255, 225, 19)":null)}} onClick={()=>{}}>{navi.page}</li>
                                    }
                                }
                            )}

                            </div>
                        </ul>

                    </Container>
                </div>

                <div className="p-0 hide-scrollbar overflow-hidden" style={{flex:4}}>           {/*Right side pages*/}
                    {currentPage === 'add-prd' && <AddProduct prdData={categories} />}
                    {currentPage === 'add-brand' && <AddBrand />}
                    {currentPage === 'add-cat' && <AddCategory category={categories?.categories?.map(cat => ({cat_name : cat.cat_name,cat_id : cat.cat_id}))} />}
                    {currentPage === 'edt-prd' && <EditSellerProducts response = {categories} onUpdate={handleUpdate} onDelete={handleDelete} />}
                    {currentPage === 'home-page' && <HomePageEdit />}
                    {currentPage === 'add-user' && <CreateUserPage />}
                    {currentPage === 'alt-user' && <AdminUsersPage />}
                </div>
            </div>
        </div>
    </div>
    </>);
}