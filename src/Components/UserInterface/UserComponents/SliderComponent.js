import React, { useRef } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function SliderComponent(props) {
  const mySlider = useRef(null);
  const matches = useMediaQuery('(max-width:1400px)');
  const imagesToRender = props.images || [];

  const setImageInSlider = () => {
    return imagesToRender.map((item, index) => (
      <div key={index}>
        <img
          src={item}
          alt={`Slide ${index}`}
          style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px' }}
        />
      </div>
    ));
  };

  const handleBack = () => mySlider.current?.slickPrev();
  const handleForward = () => mySlider.current?.slickNext();

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      {imagesToRender.length > 0 ? (
        <>
          {!matches && (
            <div style={{
              position: 'absolute', top: '44%', left: 3, zIndex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.39)', width: 39, height: 106,
              padding: 5, borderRadius: 8, display: 'flex',
              justifyContent: 'center', alignItems: 'center'
            }}>
              <ArrowBackIosNewIcon style={{ color: '#FFF' }} onClick={handleBack} />
            </div>
          )}

          <Slider {...props.bannersettings} ref={mySlider}>
            {setImageInSlider()}
          </Slider>

          {!matches && (
            <div style={{
              position: 'absolute', top: '44%', right: 3, zIndex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.39)', width: 39, height: 106,
              padding: 5, borderRadius: 8, display: 'flex',
              justifyContent: 'center', alignItems: 'center'
            }}>
              <ArrowForwardIosIcon style={{ color: '#FFF' }} onClick={handleForward} />
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: 20 }}>No banners to display</div>
      )}
    </div>
  );
}
