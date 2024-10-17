import { useEffect, useMemo, useState } from "react";
import Select2 from "../components/Select2/Select2";
import apiService from "../service/apiService";

const AddVariants = ({ setData, data }) => {
  const [variantTypeList, setVariantTypeList] = useState([]);

   const fetchVariantType = async () => {
     try {
       const response = await apiService.getRequest("variant");
       if (response) {
         const filteredVarinat = response?.variant?.map((data) => {
           return {
             value: data?._id,
             label: data?.name,
           };
         });
         console.log("filteredVarinat", filteredVarinat);
         setVariantTypeList(filteredVarinat);
       }
     } catch (error) { 
       console.log("error", error);
     }
   };
  
  useEffect(() => {
    fetchVariantType();
  }, [])
  
  const handleAddItem = () => {
    const updatedArray = [
      ...data,
      { id: Date.now(), value: "", label: "",_id:0 },
    ];
    setData(updatedArray);
  };

  const handleRemoveItem = (id) => {
    const updatedArray = data.filter((item) => item?.id !== id);
    setData(updatedArray);
  };

  const setColorInputValue = (id,value) => { 
    const inputColorEle = document.getElementById(`input-color-${id}`);
    if (inputColorEle) {
      inputColorEle.value = value;
    }
  }

  const handleChange = (name, id, newValue) => {
    const value = newValue;
    let updatedArray = [];
    if (name === 'label' && !value) {
      updatedArray = data.map((item) =>
        item?.id === id ? { ...item, value: "", label: "" } : item
      );
    } else {
      updatedArray = data.map((item) =>
        item?.id === id ? { ...item, [name]: value } : item
      );
    }
    setData(updatedArray);
  };

  const handleColorInputChange = (id, e) => {
    const newValue = e.target.value;
    if (/^#[0-9A-F]{6}$/i.test(newValue)) {
      handleChange("value", id, newValue);
    } else {
        const inputColorEle = document.getElementById(`color-${id}`);
    if (inputColorEle) {
       e.target.value= inputColorEle.value;
    }
    }
  };


  return (
    <div>
      <div className="mb-3">
        {data?.map((item, index) => {
          const selectData = variantTypeList.filter((x) => x.value === item.label);
          const defaultColorValue =
            selectData?.[0]?.label === "color" && !item?.value
              ? "#000000"
              : item?.value;
            return (
              <div key={item?.id} className="repeater-item">
                <div className="row mb-3">
                  <div className="col-md-4">
                    <Select2
                      id={`${item?.id}-label`}
                      name={`${item?.id}-label`}
                      value={item?.label === "" ? null : item?.label}
                      isMultiple={false}
                      handleOnChange={(value) => {
                        handleChange("label", item?.id, value?.value);
                      }}
                      options={variantTypeList}
                      placeholder={"Select Variation"}
                    />
                  </div>
                  <div className="col-md-4 mt-3 mt-md-0">
                    {selectData[0]?.label === "color" ? (
                      <div className="input-group mb-3">
                        <input
                          type="color"
                          style={{ maxWidth: "50px" }}
                          className="form-control form-control-color"
                          value={item?.value}
                          name="value"
                          id={`color-${item.id}`}
                          onChange={(e) => {
                            handleChange("value", item?.id, e.target.value);
                            setColorInputValue(item?.id, e.target.value);
                          }}
                        />
                        <input
                          type="text"
                          className="form-control"
                          defaultValue={defaultColorValue}
                          id={`input-color-${item.id}`}
                          name="value-color"
                          onBlur={(e) => handleColorInputChange(item?.id, e)}
                        />

                        <button className="btn btn-primary" type="button">
                          Ok
                        </button>
                      </div>
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        value={item?.value}
                        name="value"
                        onChange={(e) =>
                          handleChange("value", item?.id, e.target.value)
                        }
                      />
                    )}
                  </div>
                  <div className="col-md-2 mt-3 mt-md-0">
                    {data?.length > 1 && (
                      <button
                        className="btn bg-danger-subtle text-danger"
                        type="button"
                        onClick={() => handleRemoveItem(item?.id)}
                      >
                        <i className="ti ti-x fs-5 d-flex"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
        })}
        <button
          type="button"
          className="btn bg-primary-subtle text-primary "
          onClick={handleAddItem}
        >
          <span className="fs-4 me-1">+</span>
          Add another variation
        </button>
      </div>
    </div>
  );
};

export default AddVariants;
