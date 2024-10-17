import { Icon } from "@iconify/react";
import profilebg from "../../assets/images/backgrounds/profilebg.jpg";
import defaultProfileImage from "../../assets/images/profile/user-1.jpg";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import InputBox from "../../components/InputBox/InputBox";
import { handleNumberValidation, storeTokenInLS } from "../../constants/utilities";
import { FormProvider, useForm } from "react-hook-form";
import UploadImage from "../../components/UploadImage/UploadImage";
import DropzoneComponent from "../../components/DropZone/DropZone";
import apiService from "../../service/apiService";
import { toast } from "react-toastify";
import { updateLoginUserData } from "../../reducers/authReducer";
import "./index.css"
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";

const UserProfile = () => {
  const {
    isAdmin,
    isLoggedIn,
    loginUserData: user,
  } = useSelector((state) => state.auth);
  const isDarkThemeColor = user?.themeColor === "dark";
  const dispatch = useDispatch();
  const [image, setImage] = useState([]);
  const [profileImage, setProfileImage] = useState(
    user?.image?.url || defaultProfileImage
  );
  const mobileRef = useRef(null);
  const methods = useForm({
    reValidateMode: "onBlur",
    defaultValues: user,
  });
  const { handleSubmit, clearErrors, reset, getValues, setError, watch } =
    methods;
  const [editProfile, setEditProfile] = useState(false);
  useEffect(() => {
    console.log("image", image);
    setProfileImage(user?.image?.url || defaultProfileImage);
  }, [user]);

  const onSubmit = async (data) => {
    console.log("data", data);
    if (image?.length === 0) {
       toast.warn("Upload Profile Picture");
       return;
    }
    const id = user?._id;
    const formData = new FormData();
    const updatedData = {
      name: data?.name,
      email: data?.email,
      mobileNumber: data?.mobileNumber,
      _id: id
    };
    const formKeys = Object.keys(updatedData);

    if (!image[0]?.url) {
      image.forEach((file) => {
        formData.append("newImage", file);
      });
    }
    formKeys.forEach((key) => {
      const keyValue = updatedData[key];
      formData.append(key, keyValue);
    });
    const response = await apiService.patchRequest(`user/${id}`, formData);
    if (!response?.success) {
      toast.error('error while updating profile')
    } else {
      if (response?.user) {
        let loginData = JSON.parse(localStorage.getItem("loginUserData"));
        loginData = {
          ...loginData,
          ...response?.user,
        };
        if (response.token) {
          storeTokenInLS(response.token);
        }
        localStorage.setItem("loginUserData", JSON.stringify(loginData));
        dispatch(updateLoginUserData(loginData));
      }
      toast.success("profile updated succesfully!");
      setEditProfile(false);
    }
  };

  return (
    <div className="container-fluid">
      <BreadCrumb title={"User Profile"} />

      <div className="overflow-hidden">
        <div className="row">
          <div className="center-item m-4">
            {!editProfile && (
              <>
                <div className={`card  col-md-4 profile-form`}>
                  <div className="mt-1">
                    <div className="center-item">
                      <div className="center-item round-110 profile-image-border mt-3">
                        <div className="border border-4 border-white center-item rounded-circle overflow-hidden round-100 profile-image-border-div">
                          <img
                            src={profileImage}
                            alt="profile-picture"
                            className="w-100 h-100"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="d-grid justify-content-center text-center">
                      <h5 className="mt-2 profile-details">{user?.name}</h5>
                      <ul type="none">
                        <li>
                          <p className="mt-2 mb-2 text-dark">
                            <span className="d-flex justify-content-between align-items-center w-200 profile-details">
                              <i className="ti ti-mail fs-6"></i>
                              {user?.email}
                            </span>
                          </p>
                        </li>
                        <li>
                          <p className="mt-2 mb-2 text-dark">
                            <span className="d-flex justify-content-between align-items-center w-200 profile-details">
                              <i className="ti ti-phone fs-6"></i>
                              {user?.mobileNumber}
                            </span>
                          </p>
                        </li>
                        <li>
                          <button
                            className="btn btn-outline-light w-100 py-8 mt-2 rounded-1 w-60"
                            type="button"
                            onClick={() => setEditProfile(true)}
                          >
                            <i className="ti ti-edit fs-6"></i>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}
            <br />
            {editProfile && (
              <>
                <div className={`card col-md-5`}>
                  <div className="user-form p-5">
                    <FormProvider {...methods}>
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                          <InputBox
                            label={"Name"}
                            className="form-control border-0 ps-2"
                            id="name"
                            name="name"
                            value={user?.name}
                            validation={{
                              required: "Name is required",
                            }}
                            inputGroupProps={{
                              iconClassName: "ti ti-user fs-6",
                            }}
                          />
                        </div>
                        <div className="mb-3">
                          <InputBox
                            // type={"text"}
                            name="mobileNumber"
                            label={"Mobile Number"}
                            className="form-control border-0 ps-2"
                            value={user?.mobileNumber}
                            ref={mobileRef}
                            inputGroupProps={{
                              iconClassName: "ti ti-phone fs-6",
                            }}
                            validation={{
                              pattern: {
                                value: /^[0-9]*$/,
                                message: "Please enter only numbers",
                              },
                              required: "Mobile Number is required",
                              minLength: {
                                value: 10,
                                message:
                                  "Please enter valid 10 digit mobile number",
                              },
                              maxLength: {
                                value: 10,
                                message: "Only 10 Digits Allowed",
                              },
                            }}
                            onChange={(e) => {
                              e = handleNumberValidation(e);
                            }}
                            maxLength={10}
                          />
                        </div>
                        <div className="mb-3">
                          <InputBox
                            label={"Email Address"}
                            value={user?.email}
                            className="form-control border-0 ps-2 email-inputmask"
                            name="email"
                            id="email-mask"
                            inputGroupProps={{
                              iconClassName: "ti ti-mail fs-6",
                            }}
                            validation={{
                              required: "Email is required",
                              pattern: {
                                value:
                                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                message: "Enter a valid email address",
                              },
                            }}
                          />
                        </div>
                        <div className="mb-3">
                          <div className="d-flex align-items-center justify-content-between">
                            <DropzoneComponent
                              id={"user-profile-image"}
                              btnText={"Drop Thumbnail here to upload"}
                              maxFiles={1}
                              setFiles={setImage}
                              files={image}
                              name={"image"}
                              data={user}
                            />
                          </div>
                        </div>
                        <div className="d-flex">
                          <button
                            className={`btn btn-dark w-100 py-8 m-2 rounded-1  ${isDarkThemeColor ? "btn-light" : "btn-dark"}`}
                            type="submit"
                          >
                            Update
                          </button>
                          <button
                            className={`btn w-100 py-8 m-2 rounded-1 ${isDarkThemeColor ? "btn-outline-light" : "btn-outline-dark"}`}
                            type="button"
                            onClick={() => setEditProfile(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </FormProvider>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
