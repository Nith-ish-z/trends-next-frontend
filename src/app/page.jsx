"use client"

import Footer from '../../components/Footer.jsx';
import { Button, Card, CardBody, CardImg, CardSubtitle, CardText, CardTitle, Carousel, CarouselItem, Col, Spinner } from 'react-bootstrap';
import { IoMdHeart,IoMdHeartEmpty } from "react-icons/io";
import "./style.css"
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../components/LayoutUI.jsx';
import { get, post, remove } from '../../lib/apiClient.js';

export default function Home(){

	const [response,setResponse] = useState({val : null});

	const {user,setUser} = useContext(UserContext);
    
    const hr = () => <hr className='mx-4' />

	const addToCart = async (prd) => {
		console.log(user);
  		const res = await post(`cart/${prd.id}`);

		if (res.status !== 201) {
			console.error(res.data || 'Failed to add product');
			return;
		}

		setUser(prev => {

			if (prev.cartItem.some(item => item.productId === prd.id)){
				return {
					...prev,
					cartItem : [...prev.cartItem.map(c => c.productId === prd.id ? ({...c,count:c.count+1}) : ({...c}))]
				};
			}else

			return {
					...prev,
					cartItem : [...prev.cartItem,{
						productId : prd.id,
						name : prd.name,
						subCategory : prd.subcatname,
						count : 1,
						price : prd.price,
						url : 	prd.url
					}]
				};
		});
	};

	const toggleWish = async (prd) => {
	if (!isInWishlist(prd.id)) {
		const res = await post(`/wishlist/add?productId=${prd.id}`);
		if (res.status === 200) {
			setUser(p => ({
				...p,
				wishItem: [...p.wishItem, {
				name: prd.name,
				productId: prd.id,
				price: prd.price,
				subCategory: prd.subcatname,
				categoryId: prd.categoryId,
				url: prd.url
				}]
		}));
		}
		return;
	} else {
		const res = await remove(`wishlist/remove?productId=${prd.id}`);
		if(res.status === 200){
			setUser(p => ({
				...p,
				wishItem: p.wishItem.filter(w => w.productId !== prd.id)
				}));
			}
		}
	};

	const isInWishlist = (id) => {
		return user?.wishItem?.some(item => item?.productId === id);
	};

	async function loadHome(){
		const res = await get("/");
		if(res?.status === 200) setResponse(res.data)
			else console.error(res.data || "Error while fetching Product details");
	}
	useEffect(
		()=>
			{
				loadHome();
			},[]
	);

	
	return (
    	<div className='mainPage' style={{backgroundColor:'white',overflow:"clip"}}>

		{ response.val === null ? 
			<div className='w-100 justify-content-center d-flex bg-black bg-opacity-10 align-items-center pb-5' style={{height:"92vh"}}>
				<Spinner animation="border" role="status" variant='xxl' >
					<span className="visually-hidden">Loading...</span>
				</Spinner>
			</div> 
			:
			<div className=''>

				<div>
					<div className='d-md-none'> {/* Only for mobile screen.. single carousel */}

						<Carousel>
							{response?.carousel?.flat()?.map((item, i) => (
								<CarouselItem key={i}>
									<div style={{height : "35vh"}} className='bg-danger d-flex rounded-3 m-2 overflow-hidden' >
										<img src={item.imgUrl} alt={item.navTo.body.query} className='card-img' />
									</div>
								</CarouselItem>
							))}
						</Carousel>
						
					</div>

					<div className='d-none d-md-flex gap-3 m-2'> {/* Only for tablet and desktop screen. dual carousel */}
						{response?.carousel?.map((car,i) => 
							<div key={i} className='w-50 overflow-hidden rounded-3' style={{height:"45vh"}}>
								<Carousel>
									{car.map((item,i) =>
										<CarouselItem key={i}>
											<div style={{height:"45vh"}} className='d-flex'>
												<img src={item.imgUrl} alt={item.navTo.body.query} className='card-img' />
											</div>
										</CarouselItem>
									)}
								</Carousel>
							</div>
						)}

					</div>

				</div>

				<div className='mx-3' style={{"--item" : response?.brands?.length}}> {/* Brand auto scroll from right to left */}

					<h2 className='heading'>Brand</h2>
					
					<div className='brand-grp p-2'>
						<div className='brand-carousel'>
							{response?.brands?.map((brand,i) => (
								<div key={i} className="brand-card" style={{"--i":i+1}}>
									<img src={brand.logo} alt={brand.name+" logo"} className="img" />		
								</div>
							))}
						</div>
				</div>
			</div>

      	{hr()}

      		<div className='mx-3 mb-3'>		{/* Category section */}

    			<h2>Category</h2>
    			<div className='row mt-2 mb-2 me-2'>
					{response?.categories?.map((cat,i) => (
						<div key={i} className='col-12 col-md-6 col-lg-3'>
							<Card className="category-card">
								<div>
									<div className='overflow-hidden d-flex' style={{height : "25vh"}}>
										<img src={cat.url} className="card-img" alt={cat.title+" image"} />
									</div>
									<div className="card-body">
										<h5 className="card-title">{cat.categoryName}</h5>
										<div className='overflow-scroll hide-scrollbar card-body edge-smooth' style={{height : "20vh"}}>
											<p className="card-text">{cat?.desc}</p>
										</div>
										<div style={{textAlign:'center',width:'100%'}}>
											<a className="btn btn-primary w-75">Explore</a>
										</div>
									</div>
								</div>
							</Card>
						</div>
					))}
    			</div>
    		</div>

      	{hr()}

			<div className='m-3'> 		{/* -- Products Section -- */}

				<h2 className="heading">Products</h2>

				{response?.products?.map( (prd,i) =>
					<div className='my-3' key={i} style={{padding:"5px",border:"2px solid black",borderRadius:"15px"}}>

						<div className='m-2'>
							<div className='d-flex'>
								<p className='h3'>{prd.category}</p>
								<a className='btn btn-primary ms-auto'>More</a>
							</div>

							<hr />

							<div style={{display:"grid",gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",gap:"1em",width:"100%",alignContent:"center"}}>

								{prd.products.map( (p,i) =>
									<div key={i} style={{width:"100%", justifyItems:"center"}}>
										<Col  className="" style={{height:'min-content',width:'min-content'}}>
											<Card className='position-relative product-card' style={{width:'17rem',borderRadius:'5px'}}>
												<div>
													<CardImg variant='top' src={p.url.imageUrl} alt='product'style={{height:"35vh",width:"100%"}} />
													<div style={{position: 'absolute',top: '5px',right: '5px',display: 'flex',gap: '0px',zIndex: 10}} >
														<Button className='px-1 py-0 pb-1 wish-btn' onClick={()=>toggleWish(p)}>
															{!isInWishlist(p.id) ? <IoMdHeartEmpty /> : <IoMdHeart color='red' /> }
														</Button>
													</div>
												</div>

												<CardBody className='p-1 m-1' style={{height:"14vh"}}>
													<div className='m-0 d-inline'>
														<div>
															<CardTitle className='mb-0 pb-0 overflow-hidden' style={{height:"25px"}}>{p.name}</CardTitle>
															<div className='d-flex'>
																<CardText className='m-0 p-0 mb-1 ms-auto overflow-hidden' style={{height:"25px"}}><span>[</span>{p.subcatname}<span>]</span></CardText>
															</div>
														</div>
									
														<div className='d-flex my-1'>
															<div className='d-flex overflow-hidden bg-secondary bg-opacity-25 rounded-2' style={{width:"8vw"}}><CardSubtitle className='ms-1 my-2'><span>₹</span>{p.price.toLocaleString("en-IN")}</CardSubtitle></div>
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
			<Footer />
		</div> }

		
	</ div>)
}
