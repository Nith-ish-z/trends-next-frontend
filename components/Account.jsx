import { useContext, useState } from "react";
import { FormControl, FormGroup, FormLabel, Offcanvas, OffcanvasBody, OffcanvasHeader, OffcanvasTitle, Table } from "react-bootstrap";
import { UserContext } from "./LayoutUI";
import { post, put, remove } from "../lib/apiClient";
import { useRouter } from "next/navigation";

export default function Account({show,hideAccount}) {
    const {user,setUser} = useContext(UserContext);
    const [isEditMode,setIsEditMode] = useState(false);
    const emptyUser = {
        fName : "",
        lName : "",
        mob : 0,
        url : '',
        dob : ''
    }
    const [userDetail,setUserDetail] = useState(emptyUser)

    const handleLogout = async () => {
        const res = await post("/logout");
        if(res.status === 200){
            setUser({
                id : null,
                name : {fName : '',lName : ''},
                mob : 0,
                url : '',
                dob : '',
                cartItem : [],
                wishItem : []
            })
            alert("Logged out successfully");
            window.location.href = "/";
        }else console.error(res.data || "Error while logout")
    };

    const handleDelete = async () => {
        if(confirm("Are you sure? If you delete this account You cant able to recover this again, Instead of craeting new account.")){
            const res = await remove("user/delete");
            if(res.status === 200){
                alert("Your account deleted successfully");
                window.location.href = "/";
            }else console.error(res.data || "Error while deleting account")
        }
    };

    const handleUserDetail = (e) => {
        const {name,value} = e.target;
        if(name === 'mob') setUserDetail(p => ({...p,mob : Number(value.replace(/[^0-9]/g, ""))}))
            else setUserDetail((p)=>({...p,[name]:value}));
    }

    const handleEnableEdit = () => {
        setIsEditMode(true);
        setUserDetail(
            {
                fName : user?.name?.fname,
                lName :  user?.name?.lname,
                mob : user?.mob,
                url : user?.profileImg,
                dob : user?.dob
            }
        );
    }

    async function handleSave() {
        const res = await put('/user/update',userDetail);
        if(res.status === 200){
            setUser(res.data);
            alert("Account Details modified successfully");
            setIsEditMode(false)
        }else console.error(res.data || "Error while updating user data")
    }
    return (
        <div>
            <Offcanvas show={show} onHide={()=>hideAccount(false)} placement="end" >
                <OffcanvasHeader closeButton>
                    <OffcanvasTitle>Account details</OffcanvasTitle>
                </OffcanvasHeader>
                <OffcanvasBody>
                    <div>
                        <div className="d-flex mb-4">
                            <h4 className="mt-2">Welcome {user?.name?.fname?.charAt(0)?.toUpperCase() + user?.name?.fname?.slice(1)}!</h4>
                            <div className="ms-auto"><a className="btn btn-warning" onClick={handleLogout}>Logout</a></div>
                        </div>
                        { !isEditMode ?
                            <div>
                                
                                <div>
                                    <div className="d-flex bg-secondary bg-opacity-25 rounded-4 p-4">
                                        <div className="d-flex" style={{height:"85px",width:"85px"}}>
                                            <img src={user.profileImg || "https://www.pngmart.com/files/22/User-Avatar-Profile-Download-PNG-Isolated-Image.png"} alt="profile-img" className="rounded-circle card-img"></img>
                                        </div>
                                        <div className="ms-3 overflow-hidden mt-1" style={{width:"60%",height:"80px"}}>
                                            <h4 className="fs-4">{user.username}</h4>
                                            <p className="fs-6">{user.email || "no email"}</p>
                                        </div>
                                    </div>
                                    <div className="m-2 mt-4">
                                        <Table border={1}>
                                            <tbody>
                                                <tr>
                                                    <th>Name</th>
                                                    <td>{user.name?.fname+" "+user.name?.lname}</td>
                                                </tr>
                                                <tr>
                                                    <th>E-mail</th>
                                                    <td>{user.email}</td>
                                                </tr>
                                                <tr>
                                                    <th>Mobile</th>
                                                    <td className={user.mob === '' || user.mob === null ? "" : "text-secondary"}>{user.mob === '' || user.mob === null || 'not updated'}</td>
                                                </tr>
                                                <tr>
                                                    <th>DOB</th>
                                                    <td className={user.dob ? "" : "text-secondary"}>{user.dob || "not updated"}</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                        <div className="d-flex gap-2">
                                            <a className="btn btn-primary w-100" onClick={handleEnableEdit}>Edit</a>
                                            <a className="btn btn-danger w-100" onClick={handleDelete}>Delete Account</a>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        :
                            <div>
                                <FormGroup>
                                    <div className="mb-1 border-1 border p-2 rounded-3">
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl className="my-1" placeholder="First Name" name="fName" value={userDetail.fName} onChange={handleUserDetail} />
                                    </div>
                                    
                                    <div className="mb-1 border-1 border p-2 rounded-3">
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl className="my-1" placeholder="Last Name" name="lName" value={userDetail.lName} onChange={handleUserDetail} />
                                    </div>
                                    
                                    <div className="mb-1 border-1 border p-2 rounded-3">
                                        <FormLabel>Mobile Number</FormLabel>
                                        <FormControl className="my-1" maxLength={10} placeholder="Mobile Number" name="mob" value={userDetail.mob === 0 || userDetail.mob === null ? '' : userDetail.mob} onChange={handleUserDetail} />
                                    </div>
                                    
                                    <div className="mb-1 border-1 border p-2 rounded-3">
                                        <FormLabel>DOB</FormLabel>
                                        <FormControl className="my-1" type="date" name="dob" value={userDetail.dob} onChange={handleUserDetail} />
                                    </div>
                                    
                                    <div className="mb-1 border-1 border p-2 rounded-3">
                                        <FormLabel>Profile image url</FormLabel>
                                        <FormControl className="my-1" placeholder="Profile Image Url" name="url" value={userDetail.url} onChange={handleUserDetail} />
                                    </div>
                                </FormGroup>
                                <div className="m-2 justify-content-evenly mt-4 d-flex mx-5">
                                    <a className="btn btn-primary" onClick={handleSave}>Save</a>
                                    <a className="btn btn-danger" onClick={()=>{setIsEditMode(false);setUserDetail(emptyUser)}}>Cancel</a>
                                </div>
                            </div>
                        }
                    </div>
                </OffcanvasBody>
            </Offcanvas>
        </div>
    );
}