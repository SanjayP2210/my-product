import "./Loader.css"; // Make sure to create and style this CSS file

const Loader = ({ visible, style }) => {
  return (
    <>
      {visible && (
        <>
          <div className="spinner-div" style={style}>
            <div className="waterfall">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Loader;
