const ColorSections = ({ colors }) => {
  return (
    <div className="d-flex align-items-center gap-8 py-7">
      <h6 className="mb-0 fs-4 fw-semibold">Colors:</h6>
      {colors?.map((color, index) => {
        return (
          <>
            <a
              className="rounded-circle d-block p-6"
              style={{ background: color,boxShadow: '0 0 10px' }}
              href="javascript:void(0)"
            ></a>
          </>
        );
      })}
    </div>
  );
};

export default ColorSections