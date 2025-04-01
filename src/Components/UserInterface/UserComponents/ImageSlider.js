import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { ServerURL, getData, postData } from "../../Services/NodeServices";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const sliderSettingsMain = {
  dots: false,
  arrows: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: false,
  focusOnSelect: true,
};

const sliderSettingsThumbnails = {
  dots: false,
  arrows: true,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: false,
  focusOnSelect: true,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
      },
    },
  ],
};

const ImageSlider = ({
  productid,
  categoryid: propCategoryId,
  subcategoryid: propSubCategoryId,
}) => {
  const [nav1, setNav1] = useState();
  const [nav2, setNav2] = useState();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categoryid, setCategoryId] = useState(propCategoryId);
  const [subcategoryid, setSubCategoryId] = useState(propSubCategoryId);

  // Fetch product details if only productid is provided
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (productid && !categoryid && !subcategoryid) {
        try {
          setLoading(true);
          const result = await getData(`product/${productid}`);
          if (result?.data) {
            setCategoryId(result.data.categoryid);
            setSubCategoryId(result.data.subcategoryid);
          } else {
            setError("Product details not found");
          }
        } catch (error) {
          console.error("Failed to fetch product details:", error);
          setError("Could not retrieve product information");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProductDetails();
  }, [productid]);

  // Fetch images when all IDs are available
  useEffect(() => {
    const fetchImages = async () => {
      if (!productid) {
        setError("Product ID is required");
        return;
      }

      if (!categoryid || !subcategoryid) {
        setError("Loading product information...");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const result = await postData("userinterface/fetchallpictures", {
          categoryid,
          subcategoryid,
          productid,
        });

        if (result?.data?.length > 0) {
          setImages(result.data);
        } else {
          setImages([]);
          setError("No images available for this product");
        }
      } catch (error) {
        console.error("Image fetch error:", error);
        setError(error.message || "Failed to load images");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [productid, categoryid, subcategoryid]);

  const renderImage = (img, index) => (
    <div key={index} style={{ padding: "5px" }}>
      <img
        src={`${ServerURL}/images/${img}`}
        alt={`Product view ${index + 1}`}
        style={{
          width: "100%",
          height: "auto",
          maxHeight: "400px",
          objectFit: "contain",
        }}
        onError={(e) => {
          e.target.src = `${ServerURL}/images/default-product.png`;
          e.target.onerror = null;
        }}
      />
    </div>
  );

  return (
    <div style={{ width: "100%", margin: "0 auto" }}>
      {loading && (
        <div style={{ textAlign: "center", padding: "20px" }}>
          Loading images...
        </div>
      )}

      {error && (
        <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
          {error}
        </div>
      )}

      {!loading && !error && images.length > 0 && (
        <>
          {/* Main Slider */}
          <Slider
            {...sliderSettingsMain}
            asNavFor={nav1}
            ref={(slider) => setNav2(slider)}
          >
            {images.map(renderImage)}
          </Slider>

          {/* Thumbnail Slider */}
          <div style={{ marginTop: "10px" }}>
            <Slider
              {...sliderSettingsThumbnails}
              asNavFor={nav2}
              ref={(slider) => setNav1(slider)}
            >
              {images.map(renderImage)}
            </Slider>
          </div>
        </>
      )}
    </div>
  );
};

export default ImageSlider;
