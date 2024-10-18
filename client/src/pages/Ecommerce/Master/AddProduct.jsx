/* eslint-disable no-undef */
import { useEffect, useRef, useState } from "react";
import DropzoneComponent from "../../../components/DropZone/DropZone.jsx";
import Select2 from "../../../components/Select2/Select2.jsx";
import apiService, { BASE_URL } from "../../../service/apiService.js";
import { toast } from "react-toastify";
import ReactEditor from "../../../components/Editor/TextEditor.jsx";
import { RangeSlider } from "../../../components/RangeSlider/RangeSlider.jsx";
import AddCategory from "../../AddCategory.jsx";
import AddVariants from "../../AddVariants.jsx";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { handleNumberValidation } from "../../../constants/utilities.js";
import Loader from "../../../components/Loader/Loader.jsx";
import ReviewCard from "../../../components/ReviewCard/ReviewCard.jsx";
import { FormProvider, useForm } from "react-hook-form";
import InputBox from "../../../components/InputBox/InputBox.jsx";
import BreadCrumb from "../../../components/BreadCrumb/BreadCrumb.jsx";
import DiscountSection from "./DiscountSection.jsx";
import ColorSelector from "../Shop/ColorSelector.jsx";
import ColorSections from "../ProductDetails/ColorSections.jsx";
// import ColorSelector from "../../../components/ColorSelector/ColorSelector.jsx";
import $ from 'jquery'; // Importing jQuery
const AddProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditFlow, setIsEditFlow] = useState(false);
  const defaultValues = {
    productName: "",
    taxClass: "",
    vatAmount: 0,
    basePrice: 0,
    categories: [],
    tags: [],
    variants: [],
    description: "",
    template: [],
    thumbnail: [],
    images: [],
    stock: 0,
    gender: [],
    discountType: "no_discount",
    discountValue: 0,
    updatedPrice: 0,
  };
  const [data, setData] = useState(defaultValues);
  const [selectedColor, setSelectedColor] = useState([]);
  console.log('selectedColor',selectedColor)
  const methods = useForm({
    reValidateMode: "onBlur",
    defaultValues,
  });
  const {
    handleSubmit,
    clearErrors,
    reset,
    getValues,
    setError,
    setValue,
    register,
    watch,
    formState: { errors, isValid },
  } = methods;
  console.log("isValid", isValid);
  console.log("errors", errors);
  const [description, setDescription] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedThumbnails, setUploadedThumbnails] = useState([]);
  const [variantData, setVariantData] = useState([
    { id: Date.now(), value: "", label: "" },
  ]);
  const [selectedOption, setSelectedOption] = useState("no_discount");
  const [priceValue, setPriceValue] = useState([50]);
  const [fixedDiscount, setFixedDiscount] = useState(0);
  const [categories, setCategories] = useState([
    { value: "computer", label: "Computer" },
    { value: "watches", label: "Watches" },
    { value: "headphones", label: "Headphones" },
    { value: "beauty", label: "Beauty" },
    { value: "fashion", label: "Fashion" },
    { value: "footwear", label: "Footwear" },
  ]);
  const [statusList, setStatusList] = useState([
    { value: "Published", label: "Published" },
    { value: "Draft", label: "Draft" },
    { value: "Sheduled", label: "Sheduled" },
    { value: "Inactive", label: "Inactive" },
  ]);
  const [tagList, setTagList] = useState([
    { value: "new", label: "New" },
    { value: "trending", label: "trending" },
    { value: "headphones", label: "Headphones" },
    { value: "beauty", label: "Beauty" },
    { value: "fashion", label: "Fashion" },
    { value: "footwear", label: "Footwear" },
  ]);
  const [genderList, setGenderList] = useState([]);
  const rangeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleInput = (e) => {
    e.preventDefault();
    const name = e.target.name;
    const value = e.target.value;
    setData({
      ...data,
      [name]: value,
    });
  };

  const fetchCategories = async () => {
    try {
      const response = await apiService.getRequest("category");
      if (response) {
        const filteredCategories = response?.category?.map((cat) => {
          return {
            value: cat?._id,
            label: cat?.name,
          };
        });
        setCategories(filteredCategories);
      }
    } catch (error) {
      toast.error("error while fetching category", error);
      console.log("error", error);
    }
  };

  const fetchStatus = async () => {
    try {
      const response = await apiService.getRequest("status");
      if (response) {
        const filteredStatus = response?.status?.map((data) => {
          return {
            value: data?._id,
            label: data?.name,
          };
        });
        setStatusList(filteredStatus);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await apiService.getRequest("tag");
      if (response) {
        const filteredTags = response?.tag?.map((data) => {
          return {
            value: data?._id,
            label: data?.name,
          };
        });
        setTagList(filteredTags);
      }
    } catch (error) {
      toast.error("error while fetching tags", error);
      console.log("error", error);
    }
  };

  const fetchGender = async () => {
    try {
      const response = await apiService.getRequest("gender");
      if (response) {
        const filteredGender = response?.gender?.map((data) => {
          return {
            value: data?._id,
            label: data?.name,
          };
        });
        setGenderList(filteredGender);
      }
      setIsLoading(false);
    } catch (error) {
      toast.error("error while fetching gender", error);
    }
  };

  const getDeletedFiles = (arr1, arr2) => {
    const set2 = new Set(arr2.map((item) => item.public_id || item.path));
    return arr1.filter((item) => !set2.has(item.public_id || item.path));
  };

  const resetForm = () => {
    setData(defaultValues);
    setDescription("");
    setUploadedImages([]);
    setUploadedThumbnails([]);
    setIsLoading(false);
  };

  const onSubmit = async (data) => {
    try {
      console.log("data", data);
      if (uploadedThumbnails?.length === 0) {
        $(window).scrollTop({ behavior: "smooth" });
        toast.warn("Upload Thumbnail");
        return;
      }
      if (uploadedImages?.length === 0) {
        $("#description-label")?.[0]?.scrollIntoView();
        toast.warn("Upload Images");
        return;
      }
      // const statusValue =
      //   data.status?.length > 0 ? data?.status?.[0] : data?.status;
      const updatedData = {
        ...data,
        description,
        variants: variantData?.map(({ id, ...rest }) => {
          return { value: rest.value, label: rest?.label };
        }),
        status: data?.status,
        tags: data?.tags?.map((data) =>
          data?.value ? data?.value : data?._id
        ),
        categories: data?.categories?.map((data) =>
          data?.value ? data?.value : data?._id
        ),
        gender: data?.gender?.map((data) =>
          data?.value ? data?.value : data?._id
        ),
        template: data?.template?.value,
        colors : selectedColor,
      };
      if(!selectedColor?.length){
        toast.warn("Plase Select Product Colors");
        return;
      }
      if (!updatedData.variants[0]?.value) {
        toast.warn("Plase Add Product Variations");
        return;
      }
      if (!updatedData.categories?.length) {
        toast.warn("Plase Add Product Categories");
        return;
      }
      updatedData.updatedPrice = updatedData?.basePrice;
      updatedData.discountType = selectedOption;
      if (selectedOption === "percentage") {
        updatedData.discountValue = priceValue[0];
      } else if (selectedOption === "fixed_price") {
        updatedData.discountValue = fixedDiscount;
        if (!fixedDiscount) {
          toast.warn("Fixed Discounted Price is more then 0");
          return;
        }
      } else {
        updatedData.discountValue = 0;
      }
      delete updatedData["images"];
      delete updatedData["thumbnail"];
      const formData = new FormData();
      const formKeys = Object.keys(updatedData);
      uploadedImages.forEach((file) => {
        formData.append("newImages", file);
      });
      uploadedThumbnails.forEach((file) => {
        formData.append("newThumbnail", file);
      });
      formKeys.forEach((key) => {
        const keyValue =
          typeof updatedData[key] === "object"
            ? JSON.stringify(updatedData[key])
            : updatedData[key];
        formData.append(key, keyValue);
      });
      if (isEditFlow) {
        const imageList = uploadedImages?.filter((x) => x.public_id);
        const thumbnailList = uploadedThumbnails?.filter((x) => x.public_id);
        formData.append("images", JSON.stringify(imageList));
        formData.append("thumbnail", JSON.stringify(thumbnailList));
        const deletedImages = getDeletedFiles(data?.images, imageList);
        if (deletedImages?.length > 0) {
          formData.append("deletedImages", JSON.stringify(deletedImages));
        }
        const deletedThumbnail = getDeletedFiles(
          data?.thumbnail,
          thumbnailList
        );
        if (deletedThumbnail?.length > 0) {
          formData.append("deletedThumbnail", JSON.stringify(deletedThumbnail));
        }
      }
      console.log("updatedData", updatedData);
      setIsLoading(true);
      const response = isEditFlow
        ? await apiService.putRequest(`product/${id}`, formData)
        : await apiService.postRequest("product", formData);
      if (!response?.isError) {
        isEditFlow ? toast.success("Product Updated successfully!") 
        : toast.success("Product added successfully!");
        // 67024ebe447ddfc15275a719
        resetForm();
        navigate("/admin/product-list");
      } else {
        console.error(error);
        toast.error("Error adding product");
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding product");
      setIsLoading(false);
    }
  };

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getRequest(
        `product/product-for-edit/${id}`
      );
      let productData = response.productData;
      const { description, images, thumbnail, discountType, discountValue } =
        productData;
      setDescription(description);
      setUploadedImages(images);
      setUploadedThumbnails(thumbnail);
      setSelectedOption(discountType);
      if (discountType === "percentage") {
        setPriceValue([discountValue]);
      }
      if (discountType === "fixed_price") {
        setFixedDiscount(discountValue);
      }
      const variants = productData?.variants?.map((x) => {
        return { ...x, id: x._id, label: x.label };
      });
      setSelectedColor(productData?.colors)
      setVariantData(variants);
      setData(productData);
      reset(productData);
      setIsLoading(false);
      setIsEditFlow(true);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  useEffect(() => {
    setIsLoading(true);
    fetchCategories();
    fetchTags();
    // fetchStatus();
    fetchGender();
  }, []);

  const title = isEditFlow ? "Edit Product" : "Add Product";

  return (
    <>
      <Loader visible={isLoading} />
      <div className="container-fluid">
        <BreadCrumb title={title} />
        <FormProvider {...methods}>
          <form className="form-horizontal" onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-lg-8 ">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-7">
                      <h4 className="card-title">General</h4>

                      <button
                        className="navbar-toggler border-0 shadow-none d-md-none"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#createFormSideMenu"
                        aria-controls="createFormSideMenu"
                      >
                        <i className="ti ti-menu fs-5 d-flex"></i>
                      </button>
                    </div>
                    <div className="mb-4">
                      <InputBox
                        label={"Product Name"}
                        id="productName"
                        name="productName"
                        value={data.productName}
                        validation={{
                          required: "Product Name is required",
                          onChange: (e) => handleInput(e),
                        }}
                      />
                      <p className="fs-2">
                        A product name is required and recommended to be unique.
                      </p>
                    </div>
                    <div>
                      <label className="form-label" id="description-label">
                        Description
                      </label>
                      <ReactEditor
                        setValue={(e) => {
                          methods.setValue("description", e);
                          setDescription(e);
                        }}
                        value={data?.description}
                      />
                      <p className="fs-2 mb-0">
                        Set a description to the product for better visibility.
                      </p>
                    </div>
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
                      files={uploadedImages}
                      name={"images"}
                      data={data}
                    />
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title mb-7">Variation</h4>
                    <label className="form-label">Add Product Variations</label>
                    <AddVariants
                      setData={setVariantData}
                      data={variantData || []}
                    />
                    <br />
                    <label className="form-label">Select Product Color</label>
                    <ColorSelector
                    isMultiSelect={true}
                    setSelectedColor={setSelectedColor}
                    selectedColor={selectedColor}
                    fontSize={'26px'}
                />
                  </div>
                </div>
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title mb-7">Pricing</h4>
                    <div className="mb-7 row">
                      <div className="col-md-7">
                        <InputBox
                          label={"Base Price"}
                          id="basePrice"
                          value={data?.basePrice}
                          name="basePrice"
                          validation={{
                            required: "Base Name is required",
                            valueAsNumber: true,
                            min: {
                              value: 1,
                              message: "Base price is more than 0", // Custom error message
                            },
                            onChange: (e) => {
                              e = handleNumberValidation(e);
                              handleInput(e);
                            },
                          }}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          Stock <span className="text-danger">*</span>
                        </label>
                        <InputBox
                          value={data?.stock}
                          name="stock"
                          id="stock"
                          validation={{
                            valueAsNumber: true,
                            required: "Stock is required",
                            // min: {
                            //   value: 1,
                            //   message: "Stock is more than 0", // Custom error message
                            // },
                            onChange: (e) => {
                              e = handleNumberValidation(e);
                              handleInput(e);
                            },
                          }}
                        />
                      </div>
                    </div>
                    <DiscountSection
                      selectedOption={selectedOption}
                      setSelectedOption={setSelectedOption}
                      rangeRef={rangeRef}
                      priceValue={priceValue}
                      setPriceValue={setPriceValue}
                      fixedDiscount={fixedDiscount}
                      setFixedDiscount={setFixedDiscount}
                    />
                  </div>
                </div>
                {isEditFlow && data?.reviews?.length > 0 && (
                  <ReviewCard reviews={data?.reviews} />
                )}
              </div>
              <div className="col-lg-4 thumbnail-upload-box">
                <div
                  className="offcanvas-md offcanvas-end scroll-bar"
                  tabIndex="-1"
                  aria-labelledby="offcanvasRightLabel"
                  id="createFormSideMenu"
                >
                  <div className="card">
                    <div className="card-body">
                      <h4 className="card-title mb-7">Thumbnail</h4>
                      <DropzoneComponent
                        id={"dropzone1"}
                        btnText={"Drop Thumbnail here to upload"}
                        maxFiles={1}
                        setFiles={setUploadedThumbnails}
                        files={uploadedThumbnails}
                        name={"thumbnail"}
                        data={data}
                      />
                      <p className="fs-2 text-center mt-2">
                        Set the product thumbnail image. Only *.png, *.jpg and
                        *.jpeg image files are accepted.
                      </p>
                    </div>
                  </div>
                  {/* <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between mb-7">
                        <h4 className="card-title">Status</h4>
                        <div className="p-2 h-100 bg-success rounded-circle"></div>
                      </div>
                      <div className="form-horizontal">
                        <div>
                          <label className="form-label">Status</label>
                          <Select2
                            className="form-select mr-sm-2  mb-2"
                            id="inlineFormCustomSelect"
                            options={statusList || []}
                            value={data?.status}
                            isMultiple={false}
                            handleOnChange={(value) => {
                              setData({
                                ...data,
                                status: value,
                              });
                              setValue("status", value);
                            }}
                          />
                          <p className="fs-2 mb-0">Set the product status.</p>
                        </div>
                      </div>
                    </div>
                  </div> */}
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between mb-7">
                        <h4 className="card-title">Gender</h4>
                      </div>
                      <div>
                        <label className="form-label">Gender</label>
                        <Select2
                          className="form-select mr-sm-2  mb-2"
                          id="inlineFormCustomSelect"
                          options={genderList || []}
                          isMultiple={true}
                          value={data?.gender}
                          handleOnChange={(value) => {
                            setData({
                              ...data,
                              gender: value,
                            });
                            setValue("gender", value);
                          }}
                        />
                        <p className="fs-2 mb-0">Set the Gender</p>
                      </div>
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
                            setValue("categories", value);
                          }}
                          options={categories}
                          placeholder={"Select Categories"}
                        />
                        {/* <div className="d-flex justify-content-between">
                          <span className="fs-2 mb-0">
                            Add product to a category.
                          </span>
                          <small className="text-danger form-label error-msg">
                            category is required
                          </small>
                        </div> */}
                      </div>
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
                            methods.setValue("tags", value);
                          }}
                          options={tagList || []}
                          placeholder={"Select Tags"}
                        />
                        {/* <div className="d-flex justify-content-between">
                          <span className="fs-2 mb-0">
                            Add product to a tags.
                          </span>
                          <small className="text-danger form-label error-msg">
                            tag is required
                          </small>
                        </div> */}
                      </div>
                    </div>
                  </div>
                  {isEditFlow && (
                    <div className="card">
                      <div className="card-body">
                        <h4 className="card-title mb-2">$2,420</h4>
                        <div className="d-flex align-items-center">
                          <p className="fs-4 fw-base mb-0">
                            Average Daily Sales
                          </p>
                          <p className="fs-2 text-success bg-success-subtle mb-0 px-2 py-1 rounded-1">
                            2.6%
                          </p>
                        </div>
                        <div className="mt-7">
                          <div id="sales"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                // disabled={!isValid}
              >
                Save changes
              </button>
              <button
                type="button"
                className="btn bg-danger-subtle text-danger ms-6"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  );
};

export default AddProduct;
