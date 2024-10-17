import React from 'react'
import CategoryFilter from './CategoryFilter';
import PriceSortBy from './PriceSortBy';
import PricingFilterSection from './PricingFilterSection';
import Select2 from '../../../components/Select2/Select2';
import ColorSelector from './ColorSelector';

const FilterMenu = ({
  setCategory,
  category,
  categoriesList,
  handleSortBy,
  sortBy,
  sortOrder,
  maximumPrice,
  rangeRef,
  rangeValue,
  setRangeValue,
  genderList,
  handleOnChange,
  setSelectedColor,
  selectedColor,
  resetFilter,
  isProductLoaded,
  selectedGender
}) => {
  return (
    <>
      <ul className="list-group pt-2 border-bottom rounded-0 category-list">
        <h6 className="my-3 mx-4 fw-semibold">Filter by Category</h6>
        {isProductLoaded && (
          <CategoryFilter
            setCategory={setCategory}
            category={category}
            categoriesList={categoriesList}
          />
        )}
      </ul>
      <ul className="list-group pt-2 border-bottom rounded-0">
        <h6 className="my-3 mx-4 fw-semibold">Sort By</h6>
        {isProductLoaded && (
          <PriceSortBy
            handleSortBy={handleSortBy}
            sortBy={sortBy}
            sortOrder={sortOrder}
          />
        )}
      </ul>
      <div className="by-pricing border-bottom rounded-0">
        {isProductLoaded && (
          <PricingFilterSection
            maximumPrice={maximumPrice}
            rangeRef={rangeRef}
            rangeValue={rangeValue}
            setRangeValue={setRangeValue}
          />
        )}
      </div>
      <div className="by-gender border-bottom rounded-0">
        <h6 className="mt-4 mb-3 mx-4 fw-semibold">By Gender</h6>
        <div className="pb-4 px-4">
          <div>
            <Select2
              className="form-select mr-sm-2  mb-2"
              id="inlineFormCustomSelect"
              options={genderList || []}
              isMultiple={false}
              handleOnChange={handleOnChange}
              value={selectedGender}
            />
          </div>
        </div>
      </div>
      <div className="by-colors border-bottom rounded-0">
        <h6 className="mt-4 mb-3 mx-4 fw-semibold">By Colors</h6>
        <ColorSelector
          setSelectedColor={setSelectedColor}
          selectedColor={selectedColor}
        />
      </div>
      <div className="p-4">
        <a
          href="javascript:void(0)"
          onClick={resetFilter}
          className="btn btn-primary w-100"
        >
          Reset Filters
        </a>
      </div>
    </>
  );
};

export default FilterMenu