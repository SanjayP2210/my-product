// src/App.js
import React, { useState, useRef, useEffect, useCallback } from "react";
import "./UploadImage.css";
import { toast } from "react-toastify";
import apiService from "../../service/apiService";

const UploadImage = ({ multiple = false, setImage, data, disabled }) => {
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState([]);
  const [fileUploading, setFileUploading] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    if (data?.length > 0) {
      setPreviewImage(data);
    } else {
      setPreviewImage([]);
    }
  }, [data]);

  const uploadFile = async (e) => {
    // const selectedFile = file;
    // const value = file.value;
    // let finalImages = previewImage || [];
    let isError = false;
    const acceptedFiles = Array.from(e.target.files);
    acceptedFiles.forEach(async (file) => {
      var ext = file.type.split("/").pop().toLowerCase();
      if (file && file.size <= 1024 * 1024) {
        if (!["gif", "png", "jpg", "jpeg"].includes(ext)) {
          toast.error("Only gif, png, jpg,jpeg files are supported");
          imageRef.current.value = null;
          isError = true;
          return;
        } else {
          setFileUploading(true);

          //convert with base64 type
          // const reader = new FileReader();

          // reader.onload = () => {
          //   if (reader.readyState === 2) {
          //     finalImages = [...finalImages, reader.result];
          //   }
          //   if (finalImages?.length === acceptedFiles?.length) {
          //     setTimeout(function () {
          //       if (multiple) {
          //         setImage(finalImages);
          //       } else {
          //         setImage(finalImages[0]);
          //       }
          //       setPreviewImage(finalImages);
          //       imageRef.current.value = null;
          //     }, 150000);
          //   }
          // };
          // reader.readAsDataURL(file);
        }
      } else {
        isError = true;
        toast.error("File must be less than 1 MB.");
        imageRef.current.value = null;
        return;
      }
    });

    if (isError) return;
    setFileUploading(true);
    setLoading(true);
    setError(null);
    setUploadSuccess(false);
    const formData = new FormData();
    for (let i = 0; i < acceptedFiles.length; i++) {
      formData.append(`files[${i}]`, acceptedFiles[i]);
    }

    const response = await apiService.postRequest(
      "user/upload-image",
      formData
    );
    if (response?.isError) {
      setError("Failed to upload files");
      setLoading(false);
      setUploadSuccess(false);
    } else {
      console.log("Success:", response);
      // setPreviewImage(updatedImage);
      setPreviewImage((prevFiles) => {
        return prevFiles.concat([...(response?.images || [])]);
      });
      setImage((prevFiles) => {
        return prevFiles.concat([...(response?.images || [])]);
      });
    }
    setLoading(false);
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setError("");
    }, 2000);
  };

  const removeImage =async (e, index,file) => {
    e.preventDefault();
    e.preventDefault();
    const public_id = file?.public_id;
    const response = await apiService.deleteRequest(
      `user/delete-image/${public_id}`
    );
    if (response?.result?.result === "ok" && !response?.isError) {
      const updatedImage = previewImage.filter((x, i) => i != index);
      setImage(updatedImage);
      setPreviewImage(updatedImage);
      setFileUploading(false);
    }
  };

  const renderPreviewImages = () => {
    return previewImage?.map((img, index) => {
      return (
        <div
          key={index}
          id="uploaded_view"
          className={`uploaded_file_view ${img?.url ? "show" : ""}`}
        >
          {!disabled && (
            <span
              className="file_remove"
              onClick={(e) => {
                removeImage(e, index, img);
              }}
            >
              X
            </span>
          )}
          <img src={img?.url} alt={"user image"} />
        </div>
      );
    });
  };

  return (
    <>
      <div className="image-container">
        <div className="panel">
          {previewImage?.length > 0 ? (
            renderPreviewImages()
          ) : (
            <div
              className={`button_outer ${
                previewImage?.length > 0
                  ? "file_uploaded file_uploading"
                  : fileUploading
                  ? "file_uploading"
                  : ""
              }`}
            >
              <div className="btn_upload btn btn-outline-dark">
                <input
                  type="file"
                  id="upload_file"
                  name="userImage"
                  multiple={multiple}
                  ref={imageRef}
                  onChange={(e) => uploadFile(e)}
                  disabled={disabled}
                />
                Upload Image
              </div>
              <div className="processing_bar"></div>
              {/* <div className="success_box"></div> */}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UploadImage;
