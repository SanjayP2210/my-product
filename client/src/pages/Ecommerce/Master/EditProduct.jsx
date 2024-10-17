import { toast } from "react-toastify";
import apiService from "../../../service/apiService.js";
import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import DropzoneComponent from "../../../components/DropZone/DropZone.jsx";
import Repeator from "../../../components/Repeator/Repeator.jsx";
import Select2 from "../../../components/Select2/Select2.jsx";
import Editor from "../../../components/Editor/BootsrapEditor.jsx";
import Loader from "../../../components/Loader/Loader.jsx";
import ReactEditor from "../../../components/Editor/TextEditor.jsx";
import ReviewCard from "../../../components/ReviewCard/ReviewCard.jsx";
import { handleNumberValidation } from "../../../constants/utilities.js";
import { RangeSlider } from "../../../components/RangeSlider/RangeSlider.jsx";
import AddVariants from "../../AddVariants.jsx";

const EditProduct = () => {
   const { id } = useParams();
   const navigate = useNavigate();
  const [data, setData] = useState({
    productName: "",
    taxClass: "",
    vatAmount: 0,
    basePrice: 0,
    categories: "",
    tags: "",
    variants: [],
    description: "",
    status: "",
    template: "",
    thumbnail: [],
    images: [],
    stock: 0,
    numOfReviews: 0,
    ratings: 0,
    reviews: [],
    discountType: "no_discount",
    discountValue:0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [rangeValue, setRangeValue] = useState([50]);
  const rangeRef = useRef(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedThumbnails, setUploadedThumbnails] = useState([]);
  const [variantData, setVariantData] = useState([]);
  console.log('uploadedImages',uploadedImages);
  console.log("uploadedThumbnails", uploadedThumbnails);
  console.log('data', data);
  
   const fetchProduct= async()=> {
     try {
       setIsLoading(true);
       const response = await apiService.getRequest(`product/${id}`);
       setData(response.productData);
       const productData = response.productData;
       setDescription(productData?.description);
       setUploadedImages(productData?.images);
       setUploadedThumbnails(productData?.thumbnail);
       const variants = productData?.variants?.map((x) => {
         return { ...x, id: x._id, label : x.label };
       });
       console.log("variants", variants);
       setVariantData(variants);
       setIsLoading(false);
     } catch (error) {
       setIsLoading(false);
       console.error(error);
     }
   }
   useEffect(() => {
     fetchProduct();
   }, [id]);

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData({
      ...data,
      [name]: value,
    });
  };

 const handleSubmit = async (e) => {
   e.preventDefault();
   try {
     const updatedData = {
       ...data,
       description,
       images: uploadedImages,
       thumbnail: uploadedThumbnails,
       variants: data?.variants?.map(({ id, ...rest }) => {
         return { value: rest.value, label: rest.label };
       }),
     };
     const formData = new FormData();
     const formKeys = Object.keys(updatedData);
     formKeys.forEach((key) => {
       const keyValue =
         typeof updatedData[key] === "object"
           ? JSON.stringify(updatedData[key])
           : updatedData[key];
       formData.append(key, keyValue);
     });
     // setLoading(true);
     const response = await apiService.putRequest(`product/${id}`, formData);
     if (response) {
       toast.success("Product updated successfully!");
       setData({
         productName: "",
         taxClass: "",
         vatAmount: 0,
         basePrice: 0,
         categories: "",
         tags: "",
         variants: [],
         description: "",
         status: "",
         template: "",
         thumbnail: [],
         images: [],
       });
       setDescription("");
       setUploadedImages([]);
       setUploadedThumbnails([]);
     }
   } catch (error) {
     console.error(error);
     toast.error("Error updating product");
   }
 };

  return (
    <>
      <Loader // Type of spinner
        visible={isLoading}
      />
      <div className="container-fluid">
        <div className="card card-body py-3">
          <div className="row align-items-center">
            <div className="col-12">
              <div className="d-sm-flex align-items-center justify-space-between">
                <h4 className="mb-4 mb-sm-0 card-title">Edit Product</h4>
                <nav aria-label="breadcrumb" className="ms-auto">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item d-flex align-items-center">
                      <NavLink
                        className="text-muted text-decoration-none d-flex"
                        to={"/"}
                      >
                        <i className="ti ti-home-2 fs-6"></i>
                      </NavLink>
                    </li>
                    <li className="breadcrumb-item" aria-current="page">
                      <span className="badge fw-medium fs-2 bg-primary-subtle text-primary">
                        Edit Product
                      </span>
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
        <form className="form-horizontal" onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-lg-8 ">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-7">
                    <h4 className="card-title">General</h4>

                    <button
                      className="navbar-toggler border-0 shadow-none d-lg-none"
                      type="button"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasRight"
                      aria-controls="offcanvasRight"
                    >
                      <i className="ti ti-menu fs-5 d-flex"></i>
                    </button>
                  </div>
                  <form action="" className="form-horizontal">
                    <div className="mb-4">
                      <label className="form-label">
                        Product Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="productName"
                        id="productName"
                        required
                        autoComplete="off"
                        value={data.productName}
                        onChange={handleInput}
                      />
                      <p className="fs-2">
                        A product name is required and recommended to be unique.
                      </p>
                    </div>
                    <div>
                      <label className="form-label">Description</label>
                      <ReactEditor
                        setValue={setDescription}
                        value={data?.description}
                      />
                      <p className="fs-2 mb-0">
                        Set a description to the product for better visibility.
                      </p>
                    </div>
                  </form>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title mb-7">Media</h4>

                  <DropzoneComponent
                    id={"dropzone2"}
                    btnText={"Drop files here to upload"}
                    maxFiles={10}
                    setFiles={setUploadedImages}
                    files={data?.images}
                  />
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title mb-7">Variation</h4>

                  <label className="form-label">Add Product Variations</label>
                  {/* <Repeator setData={setVariantData} data={variantData || []} /> */}
                  <AddVariants
                    setData={setVariantData}
                    data={variantData || []}
                  />
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title mb-7">Pricing</h4>
                  <form>
                    <div className="mb-7 row">
                      <div className="col-md-7">
                        <label className="form-label">
                          Base Price <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={data?.basePrice}
                          name="basePrice"
                          placeholder="Base Price"
                          onChange={(e) => {
                            e = handleNumberValidation(e);
                            handleInput(e);
                          }}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          Stock <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={data?.stock}
                          name="stock"
                          placeholder="000"
                          min={0}
                          maxLength={3}
                          onChange={(e) => {
                            e = handleNumberValidation(e);
                            handleInput(e);
                          }}
                        />
                      </div>
                    </div>
                    <div className="mb-7">
                      <label className="form-label">Discount Type</label>
                      <nav>
                        <div
                          className="nav nav-tabs justify-content-between align-items-center gap-9"
                          id="nav-tab"
                          role="tablist"
                        >
                          <label
                            htmlFor="radio1"
                            className="form-check-label form-check p-3  border gap-2 rounded-2 d-flex flex-fill justify-content-center cursor-pointer"
                            id="customControlValidation2 nav-home-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-home"
                            aria-controls="nav-home"
                          >
                            <input
                              type="radio"
                              className="form-check-input"
                              name="discountType"
                              id="radio1"
                              value={"no_discount"}
                              checked={data?.discountType === "no_discount"}
                              onChange={(e) => {
                                e.target.checked = true;
                                handleInput(e);
                              }}
                            />
                            <span className="fs-4 text-dark">No Discount</span>
                          </label>
                          <label
                            htmlFor="radio2"
                            className="form-check-label p-3 form-check border gap-2 rounded-2 d-flex flex-fill justify-content-center cursor-pointer"
                            id="customControlValidation2 nav-home-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-profile"
                            aria-controls="nav-profile"
                          >
                            <input
                              type="radio"
                              className="form-check-input"
                              name="discountType"
                              id="radio2"
                              value={"percentage"}
                              checked={data?.discountType === "percentage"}
                              onChange={(e) => {
                                e.target.checked = true;
                                handleInput(e);
                              }}
                            />
                            <span className="fs-4 text-dark">Percentage %</span>
                          </label>
                          <label
                            htmlFor="radio3"
                            className="form-check-label form-check p-3 border gap-2 rounded-2 d-flex flex-fill justify-content-center cursor-pointer"
                            id="customControlValidation2 nav-home-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-contact"
                            aria-controls="nav-contact"
                          >
                            <input
                              type="radio"
                              className="form-check-input"
                              name="discountType"
                              id="radio3"
                              value={"fixed_price"}
                              checked={data?.discountType === "fixed_price"}
                              onChange={(e) => {
                                e.target.checked = true;
                                handleInput(e);
                              }}
                            />
                            <span className="fs-4 text-dark">Fixed Price</span>
                          </label>
                        </div>
                      </nav>
                      <div className="tab-content" id="nav-tabContent">
                        <div
                          className="tab-pane fade mt-7"
                          id="nav-profile"
                          role="tabpanel"
                          aria-labelledby="nav-profile-tab"
                          tabIndex="0"
                        >
                          <form className="mt-3">
                            <div className="form-group">
                              <label className="form-label">
                                Set Discount Percentage{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <div style={{ marging: "30px 10px" }}>
                                <RangeSlider
                                  rangeRef={rangeRef}
                                  rangeValue={rangeValue}
                                  setRangeValue={setRangeValue}
                                  id={"rangeValue"}
                                  min={0}
                                  max={100}
                                />
                              </div>
                              <br />
                              <p className="fs-2">
                                Set a percentage discount to be applied on this
                                product.
                              </p>
                            </div>
                          </form>
                        </div>
                        <div
                          className="tab-pane fade mt-7"
                          id="nav-contact"
                          role="tabpanel"
                          aria-labelledby="nav-contact-tab"
                          tabIndex="0"
                        >
                          <div className="mb-7">
                            <label className="form-label">
                              Fixed Discounted Price{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Discounted Price"
                            />
                            <p className="fs-2">
                              Set the discounted product price. The product will
                              be reduced at the determined fixed price.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-4">
                          <label className="form-label">
                            Tax Class <span className="text-danger">*</span>
                          </label>
                          <select
                            className="form-select mr-sm-2"
                            id="inlineFormCustomSelect"
                            name="taxClass"
                            value={data?.taxClass}
                            onChange={handleInput}
                          >
                            <option selected="">Select an option</option>
                            <option value="1">Tax Free</option>
                            <option value="2">Taxable Goods</option>
                            <option value="3">Downloadable Products</option>
                          </select>
                          <p className="fs-2">Set the product tax class.</p>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-4">
                          <label className="form-label">
                            VAT Amount (%){" "}
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name="vatAmount"
                            className="form-control"
                            value={data?.vatAmount}
                            onChange={(e) => {
                              e = handleNumberValidation(e);
                              handleInput(e);
                            }}
                          />
                          <p className="fs-2">Set the product VAT about.</p>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <ReviewCard reviews={data?.reviews} />
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  Save changes
                </button>
                <button
                  type="button"
                  className="btn bg-danger-subtle text-danger ms-6"
                >
                  Cancel
                </button>
              </div>
            </div>
            <div className="col-lg-4">
              <div
                className="offcanvas-lg offcanvas-end overflow-auto"
                tabIndex="-1"
                id="offcanvasRight"
                aria-labelledby="offcanvasRightLabel"
              >
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title mb-7">Thumbnail</h4>
                    <DropzoneComponent
                      id={"dropzone2"}
                      btnText={"Drop files here to upload"}
                      maxFiles={1}
                      setFiles={setUploadedThumbnails}
                      files={data?.thumbnail}
                    />
                    <p className="fs-2 text-center mb-0">
                      Set the product thumbnail image. Only *.png, *.jpg and
                      *.jpeg image files are accepted.
                    </p>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between mb-7">
                      <h4 className="card-title">Status</h4>
                      <div className="p-2 h-100 bg-success rounded-circle"></div>
                    </div>
                    <form action="" className="form-horizontal">
                      <div>
                        <Select2
                          className="form-select mr-sm-2  mb-2"
                          id="inlineFormCustomSelect"
                          options={[
                            { value: "Published", label: "Published" },
                            { value: "Draft", label: "Draft" },
                            { value: "Sheduled", label: "Sheduled" },
                            { value: "Inactive", label: "Inactive" },
                          ]}
                          isMultiple={false}
                          value={data?.status}
                          handleOnChange={(value) => {
                            setData({
                              ...data,
                              status: value,
                            });
                          }}
                        />
                        <p className="fs-2 mb-0">Set the product status.</p>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title mb-7">Product Details</h4>
                    <div className="mb-3">
                      <label className="form-label">Categories</label>
                      <Select2
                        id="categories"
                        name="categories"
                        value={data?.categories}
                        isMultiple={true}
                        handleOnChange={(value) => {
                          setData({
                            ...data,
                            categories: value,
                          });
                        }}
                        options={[
                          { value: "computer", label: "Computer" },
                          { value: "watches", label: "Watches" },
                          { value: "headphones", label: "Headphones" },
                          { value: "beauty", label: "Beauty" },
                          { value: "fashion", label: "Fashion" },
                          { value: "footwear", label: "Footwear" },
                        ]}
                        placeholder={"Select Categories"}
                      />
                      <p className="fs-2 mb-0">Add product to a category.</p>
                    </div>
                    <button
                      type="button"
                      className="btn bg-primary-subtle text-primary "
                    >
                      <span className="fs-4 me-1">+</span>
                      Create New Category
                    </button>
                    <div className="mt-7">
                      <label className="form-label">Tags</label>
                      <Select2
                        id="tags"
                        name="tags"
                        value={data?.tags}
                        isMultiple={true}
                        handleOnChange={(value) => {
                          setData({
                            ...data,
                            tags: value,
                          });
                        }}
                        options={[
                          { value: "new", label: "New" },
                          { value: "trending", label: "trending" },
                          { value: "headphones", label: "Headphones" },
                          { value: "beauty", label: "Beauty" },
                          { value: "fashion", label: "Fashion" },
                          { value: "footwear", label: "Footwear" },
                        ]}
                        placeholder={"Select Tags"}
                      />
                      <p className="fs-2 mb-0">Add product to a category.</p>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title mb-2">$2,420</h4>
                    <div className="d-flex align-items-center">
                      <p className="fs-4 fw-base mb-0">Average Daily Sales</p>
                      <p className="fs-2 text-success bg-success-subtle mb-0 px-2 py-1 rounded-1">
                        2.6%
                      </p>
                    </div>
                    <div className="mt-7">
                      <div id="sales"></div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title mb-7">Product Template</h4>
                    <form action="" className="form-horizontal">
                      <div>
                        <label className="form-label text-nowrap">
                          Select a product template
                        </label>
                        <Select2
                          id="template inlineFormCustomSelect"
                          name="template"
                          className="form-select mr-sm-2  mb-2"
                          value={data?.template}
                          isMultiple={false}
                          handleOnChange={(value) => {
                            setData({
                              ...data,
                              template: value,
                            });
                          }}
                          options={[
                            {
                              value: "Default Template",
                              label: "Default Template",
                            },
                            { value: "Fashion", label: "Fashion" },
                            {
                              value: "Office Stationary",
                              label: "Office Stationary",
                            },
                            { value: "Electronics", label: "Electronics" },
                          ]}
                          placeholder={"Select product template"}
                        />
                        <p className="fs-2 mb-0">
                          Assign a template from your current theme to define
                          how a single product is displayed.
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProduct;
