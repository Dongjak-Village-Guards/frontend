import React from "react";
import styled from "styled-components";

const PromotionBanner = ({ banner }) => {
  const { image, subtitle, title, onClick } = banner;

  return (
    <BannerWrapper onClick={onClick}>
      <BannerImage src={image} alt="프로모션 배너" />
      <BannerSub>{subtitle}</BannerSub>
      <BannerText dangerouslySetInnerHTML={{ __html: title }} />
    </BannerWrapper>
  );
};

// ===== Styled Components ===== //
const BannerWrapper = styled.div`
  margin: 12px 20px 0 20px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const BannerImage = styled.img`
  width: 100%;
  height: 110px;
  object-fit: cover;
  display: block;
`;

const BannerText = styled.div`
  position: absolute;
  left: 0; right: 0; bottom: 10px;
  color: #fff;
  font-size: 22px;
  font-weight: 700;
  text-shadow: 0 2px 8px rgba(0,0,0,0.14);
  padding-left: 14px;
  line-height: 1.2;
`;

const BannerSub = styled.div`
  position: absolute;
  left: 14px; top: 12px;
  color: #fff;
  font-size: 15px;
  font-weight: 400;
`;

export default PromotionBanner; 