import axios from "axios";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import apiService from "../../service/apiService";
import "./index.css";

const DropzoneComponent = ({
  id,
  maxFiles,
  setFiles,
  files = [],
  height,
  style,
  data,
  name,
  ref,
}) => {
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState([]);
  console.log("files", files);

  // useEffect(() => {
  //   if (files?.length > 0) {
  //     setPreviewImage(files);
  //   }
  // }, [files]);

  useEffect(() => {
    if (data?.[name] && data?.[name]?.length > 0) {
      const imageList = data?.[name];
      setPreviewImage(imageList);
      // } else {
      //   setPreviewImage(
      //     data?.image?.url && data?.image?.url?.includes("res.cloudinary.com")
      //       ? [data?.image?.url]
      //       : []
      //   );
      // }
      setFiles(imageList);
      }
    if (data?.[name]?.url?.length > 0) { 
      const image =
        data?.image?.url && data?.image?.url?.includes("res.cloudinary.com")
          ? [data?.image]
          : [];
      setPreviewImage(image);
    setFiles(image);
    }
  }, [data?.[name]]);

  //   useEffect(() => {
  //     const $ = window.jQuery;
  //     const Dropzone = window.Dropzone;

  //     if (dropzoneRef.current && Dropzone) {
  //       const dropzoneOptions = {
  //         url: "http://localhost:3001/api/user/upload-image", // Change this to your upload URL
  //         maxFiles: maxFiles,
  //         addRemoveLinks: true,
  //         clickable: isClickable, // Pass the clickable state to Dropzone
  //         dictDefaultMessage: "Drop files here or click to upload",
  //         init: function () {
  //           this.on("addedfile", function (file) {
  //             console.log("A file has been added to Dropzone:", file);
  //             setUploadedFiles((prevFiles) => {
  //               if (prevFiles.length >= maxFiles) {
  //                 this.options.clickable = false;
  //                 setIsClickable(false);
  //                 dropzoneRef.current.disabled = true;
  //               }
  //               return [...prevFiles, file];
  //             });
  //           });
  //           this.on("removedfile", function (file) {
  //             console.log("A file has been removed from Dropzone:", file);
  //             setUploadedFiles((prevFiles) =>
  //               prevFiles.filter((f) => f !== file)
  //             );
  //             this.options.clickable = true;
  //             setIsClickable(true);
  //             dropzoneRef.current.disabled = false;
  //           });
  //           this.on("maxfilesexceeded", function (file) {
  //             console.log("Max files exceeded. File not added:", file);
  //           });
  //         },
  //       };

  //       const dz = new Dropzone(dropzoneRef.current, dropzoneOptions);

  //       // Cleanup to avoid memory leaks
  //       return () => {
  //         dz.destroy();
  //       };
  //     }
  //   }, [id]);

  const fileToBase64 = (file) => {
    if (!file) return;
    var ext = file.type.split("/").pop().toLowerCase();
    if (file && file.size <= 1024 * 1024) {
      if (!["gif", "png", "jpg", "jpeg"].includes(ext)) {
        toast.error("Only gif, png, jpg,jpeg files are supported");
        return null;
      } else {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      }
    } else {
      toast.error("File must be less than 1 MB.");
      return null;
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    try {
      let isError = false;
      if (files?.length >= maxFiles) return;
      acceptedFiles.forEach((file) => {
        if (!file) return;
        var ext = file.type.split("/").pop().toLowerCase();
        if (file && file.size <= 1024 * 1024) {
          if (!["gif", "png", "jpg", "jpeg"].includes(ext)) {
            toast.error("Only gif, png, jpg,jpeg files are supported");
            isError = true;
            return;
          } else {
            isError = false;
          }
        } else {
          isError = true;
          toast.error("File must be less than 1 MB.");
          return;
        }
      });

      if (isError) return;
      setLoading(true);
      setError(null);
      setUploadSuccess(false);
      const formData = new FormData();
      for (let i = 0; i < acceptedFiles.length; i++) {
        formData.append(`files[${i}]`, acceptedFiles[i]);
      }

      setFiles((prevFiles) => {
        return prevFiles.concat([...(acceptedFiles || [])]);
      });
      const filePreviews = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setPreviewImage((prevFiles) => {
        return prevFiles.concat([...(filePreviews || [])]);
      });

      // const response = await apiService.postRequest(
      //   "user/upload-image",
      //   formData
      // );
      // if (response?.isError) {
      //   setError("Failed to upload files");
      //   setLoading(false);
      //   setUploadSuccess(false);
      // } else {
      //   console.log("Success:", response);
      //   // setPreviewImage(updatedImage);
      //   setPreviewImage((prevFiles) => {
      //     return prevFiles.concat([...(response?.images || [])]);
      //   });
      //   setFiles((prevFiles) => {
      //     return prevFiles.concat([...(response?.images || [])]);
      //   });
      // }
      setLoading(false);
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setError("");
      }, 2000);
    } catch (error) {
      console.error("Error uploading files:", error);
      setError("Failed to upload files");
      setLoading(false);
      setUploadSuccess(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/*",
    onDrop,
  });

  //   return (
  //     <div>
  //       {/* <button id="upload-button" className="btn btn-primary">
  //         Upload Files
  //       </button> */}
  //       <form ref={dropzoneRef} className="dropzone" id={`${id}-dropzone`}>
  //         <div className="dz-default dz-message">
  //           <button
  //             id={`${id}-upload-button`}
  //             className="dz-button"
  //             type="button"
  //           >
  //             {btnText}
  //           </button>
  //         </div>
  //       </form>
  //     </div>
  //   );

  const removeImage = async (e, index, file) => {
    e.preventDefault();
    // const public_id = file?.public_id;
    // const response = await apiService.deleteRequest(
    //   `user/delete-image/${public_id}`
    // );
    // if (response?.result?.result === "ok" && !response?.isError) {
    const updatedImage = previewImage.filter((x, i) => i != index);
    setPreviewImage(updatedImage);
    setFiles(updatedImage);
    //  const formData = new FormData();
    //  for (let i = 0; i < acceptedFiles.length; i++) {
    //    formData.append(`files[${i}]`, acceptedFiles[i]);
    //  }
  };

  const thumbs = useMemo(
    () =>
      previewImage?.map((file, index) => (
        <>
          <div
            className={`col-4 ps-0 m-3`}
            key={index}
            style={{ maxWidth: "100px" }}
          >
            <div className="position-relative w-100 h-100">
              <span
                // className="file_remove"
                onClick={(e) => {
                  removeImage(e, index, file);
                }}
              >
                <i className="ti ti-x fill-white file-remove-icon"></i>
              </span>
              <div className="file-image-view">
                <img
                  src={file?.url || file?.preview}
                  alt={"user image"}
                  className="w-100 rounded-0"
                />
              </div>
            </div>
          </div>
        </>
        // <div
        //   key={index}
        //   id="uploaded_view"
        //   className={`uploaded_file_view ${file?.url ? "show" : ""}`}
        // >
        //   {!disabled && }
        //   )}
        //   <img src={file?.url} alt={"user image"} />
        //    <div className="col-lg-3 col-md-6" key={index}>
        //     <span
        //       className="file_remove"
        //       onClick={(e) => {
        //         removeImage(e, index);
        //       }}
        //     >
        //       X
        //     </span>
        //     <div className="card overflow-hidden">
        //       <div className="el-card-item pb-3">
        //         <div
        //           className="w-100
        //                   overflow-hidden
        //                   position-relative
        //                   text-center
        //                 "
        //         >
        //           <img
        //             src={file?.url}
        //             alt={"user image"}
        //             className="d-block position-relative w-100"
        //           />
        //         </div>
        //       </div>
        //     </div>
        //   </div>

        // </div>
      )),
    [previewImage]
  );

  return (
    <div className="container">
      <div className="row el-element-overlay">
        {previewImage?.length >= maxFiles ? null : (
          <>
            <div
              className={`${
                previewImage?.length === 0 || maxFiles === 1
                  ? "col-md-12"
                  : "col-md-4"
              }`}
            >
              <div
                style={{
                  display: loading ? "none" : "flex",
                  cursor: "pointer",
                  minHeight: height,
                  width:
                    maxFiles === 1
                      ? previewImage?.length > 0
                        ? "200px"
                        : "auto"
                      : "auto",
                  ...style,
                }}
                id={`${id}-dropzone`}
                {...getRootProps({
                  className: "dropzone",
                  ariaDisabled: maxFiles >= files?.length,
                })}
              >
                <input className="dz-button" {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the files here ...</p>
                ) : (
                  <p>Drag and drop file here, or click to select</p>
                )}
              </div>
              {loading && (
                <div
                  className="dropzone d-flex justify-content-center align-items-center mt-3"
                  style={{ color: "black" }}
                >
                  <div className="spinner-border" role="status"></div>
                  <span style={{ marginLeft: "10px" }}>
                    {"   "} Uploading...
                  </span>
                </div>
              )}{" "}
            </div>
          </>
        )}
        <div
          className={`${
            previewImage?.length >= maxFiles
              ? "col-md-12 justify-content-center"
              : "col-md-8 scrollbar"
          } d-flex view-box scroll-bar`}
        >
          {thumbs}
        </div>
      </div>

      {!loading && uploadSuccess && (
        <div className="alert alert-success mt-3" role="alert">
          Files uploaded successfully!
        </div>
      )}
      {!loading && error && (
        <div className="alert alert-danger mt-3" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default DropzoneComponent;
