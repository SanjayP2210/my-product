import { useWizard } from "react-use-wizard";
const list = ["Cart", "Billing & address", "Payment"];
export const Header = ({ completedStep }) => {
  const { activeStep, stepCount, previousStep, nextStep, goToStep } =
      useWizard();
  const handleSelectedTab = (target) => {
    const currTab = parseInt(target.id) - 1;
    if (activeStep - 1 === currTab) {
      goToStep(currTab);
    }
  };

  return (
    <>
      <div className="steps clearfix">
        <ul role="tablist">
          {Array.from({ length: stepCount }).map((_, index) => (
            <>
              <li
                role="tab"
                className={`${index === 0 ? "first" : ""} ${
                  index < activeStep ? "done" : ""
                } ${index === activeStep ? "current" : ""}`}
                aria-disabled="false"
                aria-selected="true"
              >
                <a
                  id={`steps-uid-0-t-${index}`}
                  href="javascript:void(0)"
                  aria-controls={`steps-uid-0-p-${index}`}
                  defaultValue={index}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelectedTab(e.target);
                  }}
                >
                  <span className="current-info audible">current step: </span>
                  <span className="step" id={index + 1}>
                    {index <= activeStep - 1 ? (
                      <i id={index + 1} className="ti ti-check fs-3"></i>
                    ) : (
                        <span id={index + 1}>{index + 1}</span>
                    )}
                  </span>
                  {list[index]}
                </a>
              </li>
            </>
          ))}
        </ul>
      </div>
    </>
  );
};