import React from "react";

const DeliveryOption = () => {
  const getTwoDaysLater = () => {
    const today = new Date(); // Get the current date
    const fiveDaysLater = new Date(today); // Create a new Date object based on today
    fiveDaysLater.setDate(today.getDate() + 5); // Add 2 days

    return fiveDaysLater; // Return the new date
  };

  const formatDate = (date) => {
    const options = { weekday: "long", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options); // Format the date
  };

  const fiveDaysLater = getTwoDaysLater();

  return (
    <div className="delivery-option btn-group-active  card shadow-none border">
      <div className="card-body p-4">
        <h6 className="mb-3 fw-semibold fs-4">Delivery Option</h6>
        <div
          className="btn-group flex-row gap-3 w-100"
          role="group"
          aria-label="Basic radio toggle button group"
        >
          <div className="position-relative form-check btn-custom-fill flex-fill ps-0">
            <input
              type="radio"
              className="form-check-input ms-4 round-16"
              name="deliveryOpt1"
              id="btnradio1"
              autoComplete="off"
              checked
            />
            <label
              className="btn btn-outline-primary mb-0 p-3 rounded ps-5 w-100"
              htmlFor="btnradio1"
            >
              <div className="text-start ps-2">
                <h6 className="fs-4 fw-semibold mb-0">Free delivery</h6>
                <p className="mb-0 text-muted">
                  Delivered on {formatDate(fiveDaysLater)}
                </p>
              </div>
            </label>
          </div>
          {/* <div className="position-relative form-check btn-custom-fill flex-fill ps-0">
                  <input
                    type="radio"
                    className="form-check-input ms-4 round-16"
                    name="deliveryOpt1"
                    id="btnradio2"
                    autoComplete="off"
                  />
                  <label
                    className="btn btn-outline-primary mb-0 p-3 rounded ps-5 w-100"
                    htmlFor="btnradio2"
                  >
                    <div className="text-start ps-2">
                      <h6 className="fs-4 fw-semibold mb-0">
                        Fast delivery ($2,00)
                      </h6>
                      <p className="mb-0 text-muted">
                        Delivered on Wednesday, May 8
                      </p>
                    </div>
                  </label>
                </div> */}
        </div>
      </div>
    </div>
  );
};

export default DeliveryOption;
