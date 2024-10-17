import React, { useEffect, useState } from "react";
import apiService from "../../../service/apiService";
import RatingComponent from "../../../components/Rating/RatingComponent";
import { useNavigate } from "react-router-dom";
import { formatToINR } from "../../../constants/utilities";
import ProductCard from "../ProductCard/ProductCard";

const RelatedProducts = ({ productId }) => {
  const navigate = useNavigate();
  const [relatedProducts, setRelatedProducts] = useState([]);


   const getSelectedProductDetails = (productId) => {
     navigate(`/product-detail/${productId}`);
   };

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await apiService.getRequest(
          `product/related/${productId}`
        );
        if(response?.relatedProducts){
          setRelatedProducts(response?.relatedProducts);
        }
      } catch (error) {
        console.error("Error fetching related products", error);
      }
    };

    fetchRelatedProducts();
  }, [productId]);

  return (
    <div className="related-products pt-7">
      <h4 className="mb-3 fw-semibold">Related Products</h4>
      <div className="row">
        {relatedProducts?.map((product,index) => {
          const { image, productName, updatedPrice, basePrice, ratings } =
            product;
          return (
            <>
              <div key={product._id} className="col-md-4 col-xxl-3">
                <ProductCard 
                  product={product}
                  isFromRealatedProduct={true}
                />
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;
