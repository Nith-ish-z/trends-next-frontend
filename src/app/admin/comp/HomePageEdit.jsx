import { useContext, useState } from "react";
import { FormControl,FormGroup,FormLabel,FormSelect,InputGroup,Row,Col,FormCheck } from "react-bootstrap";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import { UserContext } from "../../../../components/LayoutUI";
import { post } from "../../../../lib/apiClient";

export default function HomePageEdit() {

    const emptyHome = {
        carousel: [
            [
                { imgUrl: '', navTo: { body: { query: '', categoryId: 0 } } }
            ],
            [
                { imgUrl: '', navTo: { body: { query: '', categoryId: 0 } } }
            ]
        ],
        brands: {
            limit: 10,
            selected: []
        },
        categories: [
            { categoryId: 0, categoryName: "", url: "" },
            { categoryId: 0, categoryName: "", url: "" },
            { categoryId: 0, categoryName: "", url: "" },
            { categoryId: 0, categoryName: "", url: "" }
        ],
        products: [
            { categoryId: 0, subCategoryId: 0, count: 10 }
        ]
    };

    const newCarouselItem = {
        imgUrl: '',
        navTo: { body: { query: '', categoryId: 0 } }
    };

    const newProductItem = {
        categoryId: 0,
        subCategoryId: 0,
        count: 10
    };

    const [homeContent, setHomeContent] = useState(emptyHome);
    const { categories } = useContext(UserContext);
    const brands = categories?.brands || [];

    const handlePaste = async (sectionIndex, itemIndex) => {
        const text = await navigator.clipboard.readText();
        setHomeContent(prev => {
            const updated = { ...prev };
            updated.carousel = [...prev.carousel];
            updated.carousel[sectionIndex] = [...prev.carousel[sectionIndex]];
            updated.carousel[sectionIndex][itemIndex] = {
                ...prev.carousel[sectionIndex][itemIndex],
                imgUrl: text
            };
            return updated;
        });
    };

    const handleAddCarousel = (sectionIndex) => {
        setHomeContent(prev => {
            const updated = { ...prev };
            updated.carousel = [...prev.carousel];
            updated.carousel[sectionIndex] = [
                ...prev.carousel[sectionIndex],
                { ...newCarouselItem }
            ];
            return updated;
        });
    };

    const handleDeleteCarousel = (sectionIndex, itemIndex) => {
        setHomeContent(prev => {
            if (prev.carousel[sectionIndex].length === 1) return prev;
            const updated = { ...prev };
            updated.carousel = [...prev.carousel];
            updated.carousel[sectionIndex] =
                prev.carousel[sectionIndex].filter((_, i) => i !== itemIndex);
            return updated;
        });
    };

    const handleBrandLimitChange = (limit) => {
        setHomeContent(prev => ({
            ...prev,
            brands: {
                limit,
                selected: prev.brands.selected.slice(0, limit)
            }
        }));
    };

    const handleBrandToggle = (brandId) => {
        setHomeContent(prev => {
            const { selected, limit } = prev.brands;

            if (selected.includes(brandId)) {
                return {
                    ...prev,
                    brands: {
                        ...prev.brands,
                        selected: selected.filter(id => id !== brandId)
                    }
                };
            }

            if (selected.length >= limit) return prev;

            return {
                ...prev,
                brands: {
                    ...prev.brands,
                    selected: [...selected, brandId]
                }
            };
        });
    };

    const handleSelectAllBrands = (checked) => {
        setHomeContent(prev => ({
            ...prev,
            brands: {
                ...prev.brands,
                selected: checked
                    ? brands.slice(0, prev.brands.limit).map(b => b.id)
                    : []
            }
        }));
    };

    const addProduct = () => {
        setHomeContent(prev => ({
            ...prev,
            products: [...prev.products, { ...newProductItem }]
        }));
    };

    const deleteProduct = (index) => {
        setHomeContent(prev => ({
            ...prev,
            products: prev.products.filter((_, i) => i !== index)
        }));
    };

    const updateProduct = (index, updater) => {
        setHomeContent(prev => {
            const updated = { ...prev };
            updated.products = [...prev.products];
            updated.products[index] = updater(prev.products[index]);
            return updated;
        });
    };

    async function handleSubmit (){
        const res = await post('admin/home',homeContent);
        if(res.status === 200){
            setHomeContent(emptyHome);
            alert("HomePage Succesfully Modified");
            return
        }else console.error(res.data || "Error while updating home data")

        console.log(res);
    };

    return (
        <div className="p-3 overflow-scroll" style={{ maxHeight: "91vh" }}>

            <div className="d-flex">
                <h2 className="mb-4" style={{ fontFamily: "marcellus",fontWeight: "normal"}}>Edit HomePage View</h2>
                <div className="ms-auto">
                    <a className="btn btn-primary" onClick={handleSubmit}>Submit</a>
                </div>
            </div>

            <div className="p-3 mb-4 rounded-3 border border-secondary">
                <h3 style={{ fontFamily: "marcellus",fontWeight: "normal"}}>Carousel Section</h3>

                {homeContent.carousel.map((section, i) => (
                    <div key={i}>
                        <div className="d-flex mb-2">
                            <h5>Section {i + 1}</h5>
                            <button
                                className="btn btn-warning ms-auto"
                                onClick={() => handleAddCarousel(i)}
                            >
                                Add
                            </button>
                        </div>

                        {section.map((c, ind) => (
                            <div key={ind} className="bg-light p-3 rounded mb-3">
                                <FormGroup>

                                    <div className="d-flex mb-1">
                                        <FormLabel>Image URL</FormLabel>
                                        <button
                                            className="btn btn-danger btn-sm ms-auto"
                                            onClick={() => handleDeleteCarousel(i, ind)}
                                        >
                                            Delete
                                        </button>
                                    </div>

                                    <InputGroup className="mb-2">
                                        <FormControl
                                            value={c.imgUrl}
                                            placeholder="Enter image Url"
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setHomeContent(prev => {
                                                    const updated = { ...prev };
                                                    updated.carousel = [...prev.carousel];
                                                    updated.carousel[i] = [...prev.carousel[i]];
                                                    updated.carousel[i][ind] = {
                                                        ...prev.carousel[i][ind],
                                                        imgUrl: value
                                                    };
                                                    return updated;
                                                });
                                            }}
                                        />
                                        <InputGroupText>
                                            <button
                                                className="btn p-0"
                                                onClick={() => handlePaste(i, ind)}
                                            >
                                                Paste
                                            </button>
                                        </InputGroupText>
                                    </InputGroup>

                                    <FormControl
                                        className="mb-2"
                                        placeholder="Search query"
                                        value={c.navTo.body.query}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setHomeContent(prev => {
                                                const updated = { ...prev };
                                                updated.carousel = [...prev.carousel];
                                                updated.carousel[i] = [...prev.carousel[i]];
                                                updated.carousel[i][ind] = {
                                                    ...prev.carousel[i][ind],
                                                    navTo: {
                                                        ...prev.carousel[i][ind].navTo,
                                                        body: {
                                                            ...prev.carousel[i][ind].navTo.body,
                                                            query: value
                                                        }
                                                    }
                                                };
                                                return updated;
                                            });
                                        }}
                                    />

                                    <FormSelect
                                        value={c.navTo.body.categoryId}
                                        onChange={(e) => {
                                            const value = Number(e.target.value);
                                            setHomeContent(prev => {
                                                const updated = { ...prev };
                                                updated.carousel = [...prev.carousel];
                                                updated.carousel[i] = [...prev.carousel[i]];
                                                updated.carousel[i][ind] = {
                                                    ...prev.carousel[i][ind],
                                                    navTo: {
                                                        ...prev.carousel[i][ind].navTo,
                                                        body: {
                                                            ...prev.carousel[i][ind].navTo.body,
                                                            categoryId: value
                                                        }
                                                    }
                                                };
                                                return updated;
                                            });
                                        }}
                                    >
                                        <option value={0} disabled>Select Category</option>
                                        {categories?.categories?.map((cat, idx) => (
                                            <option key={idx} value={cat.cat_id}>
                                                {cat.cat_name}
                                            </option>
                                        ))}
                                    </FormSelect>

                                </FormGroup>
                            </div>
                        ))}
                        {i === 0 && <hr />}
                    </div>
                ))}
            </div>

            <div className="p-3 rounded-3 border border-secondary">
                <div className="d-flex align-items-center mb-3">
                    <h3 className="me-3" style={{ fontFamily: "marcellus",fontWeight: "normal"}}>Brand Section</h3>

                    <FormCheck
                        className="ms-auto"
                        type="switch"
                        label="Select All"
                        checked={
                            homeContent.brands.selected.length ===
                            Math.min(homeContent.brands.limit, brands.length)
                        }
                        onChange={(e) =>
                            handleSelectAllBrands(e.target.checked)
                        }
                    />
                </div>

                <div className="d-flex">
                    <FormLabel htmlFor="brand-limit" className="mt-2 me-4 fs-5">Brand count</FormLabel>
                    
                    <FormSelect
                        id="brand-limit"
                        style={{ width: 120 }}
                        value={homeContent.brands.limit}
                        onChange={(e) =>
                            handleBrandLimitChange(Number(e.target.value))
                        }
                    >
                        {[10, 15, 20, 25, 30].map(v => (
                            <option key={v} value={v}>{v}</option>
                        ))}
                    </FormSelect>
                </div>

                <hr />

                <Row>
                    {brands.map((brand, index) => {
                        const checked =
                            homeContent.brands.selected.includes(brand.id);
                        const disabled =
                            !checked &&
                            homeContent.brands.selected.length >=
                            homeContent.brands.limit;

                        return (
                            <Col md={3} key={index} className="mb-2">
                                <FormCheck
                                    type="checkbox"
                                    label={brand.name}
                                    checked={checked}
                                    disabled={disabled}
                                    onChange={() => handleBrandToggle(brand.id)}
                                />
                            </Col>
                        );
                    })}
                </Row>
            </div>

            <div className="mt-4">
                <h2 style={{ fontFamily: "marcellus",fontWeight: "normal"}}>Category Section</h2>

                {homeContent.categories.map((c, i) => (
                    <div key={i} className="p-2 bg-light rounded-3 my-2">
                        <FormGroup>

                            <FormSelect
                                value={c.categoryId}
                                onChange={(e) => {
                                    const selectedId = Number(e.target.value);
                                    const selectedName =
                                        categories.categories.find(
                                            cat => cat.cat_id === selectedId
                                        )?.cat_name || "";

                                    setHomeContent(prev => {
                                        const updated = { ...prev };
                                        updated.categories = [...prev.categories];
                                        updated.categories[i] = {
                                            ...prev.categories[i],
                                            categoryId: selectedId,
                                            categoryName: selectedName
                                        };
                                        return updated;
                                    });
                                }}
                            >
                                <option value={0} disabled>Select Category</option>
                                {categories?.categories?.map((cat, ind) => (
                                    <option key={ind} value={cat.cat_id}>
                                        {cat.cat_name}
                                    </option>
                                ))}
                            </FormSelect>

                            <FormControl
                                placeholder="Enter url"
                                className="my-2"
                                value={c.url}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setHomeContent(prev => {
                                        const updated = { ...prev };
                                        updated.categories = [...prev.categories];
                                        updated.categories[i] = {
                                            ...prev.categories[i],
                                            url: value
                                        };
                                        return updated;
                                    });
                                }}
                            />

                        </FormGroup>
                    </div>
                ))}
            </div>

            <div className="p-3 mb-4 rounded-3 border">
                <div className="d-flex mb-3">
                    <h3 style={{ fontFamily: "marcellus",fontWeight: "normal"}}>Products</h3>
                    <button className="btn btn-warning ms-auto" onClick={addProduct}>
                        Add
                    </button>
                </div>

                {homeContent.products.map((p, i) => {
                    const selectedCategory =
                        categories?.categories?.find(c => c.cat_id === p.categoryId);

                    return (
                        <div key={i} className="bg-light p-3 rounded mb-3">
                            <FormGroup>

                                <FormSelect
                                    className="mb-2"
                                    value={p.categoryId}
                                    onChange={(e) => {
                                        const categoryId = Number(e.target.value);
                                        updateProduct(i, () => ({
                                            categoryId,
                                            subCategoryId: 0,
                                            count: p.count
                                        }));
                                    }}
                                >
                                    <option value={0} disabled>Select Category</option>
                                    {categories?.categories?.map((cat, idx) => (
                                        <option key={idx} value={cat.cat_id}>
                                            {cat.cat_name}
                                        </option>
                                    ))}
                                </FormSelect>

                                <FormSelect
                                    className="mb-2"
                                    value={p.subCategoryId}
                                    disabled={!p.categoryId}
                                    onChange={(e) =>
                                        updateProduct(i, prev => ({
                                            ...prev,
                                            subCategoryId: Number(e.target.value)
                                        }))
                                    }
                                >
                                    <option value={0} disabled>Select Sub Category</option>
                                    {selectedCategory?.sub_cat?.map((sub, idx) => (
                                        <option key={idx} value={sub.sub_cat_id}>
                                            {sub.sub_cat_name}
                                        </option>
                                    ))}
                                </FormSelect>

                                <FormSelect
                                    className="mb-2"
                                    value={p.count}
                                    onChange={(e) =>
                                        updateProduct(i, prev => ({
                                            ...prev,
                                            count: Number(e.target.value)
                                        }))
                                    }
                                >
                                    {[10, 15, 20, 25, 30].map(v => (
                                        <option key={v} value={v}>{v}</option>
                                    ))}
                                </FormSelect>

                                {i !== 0 && (
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => deleteProduct(i)}
                                    >
                                        Delete
                                    </button>
                                )}
                            </FormGroup>
                        </div>
                    );
                })}
            </div>

        </div>
    );
}
