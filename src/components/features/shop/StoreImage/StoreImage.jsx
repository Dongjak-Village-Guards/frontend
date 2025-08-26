/**
 * 가게 사진 정보를 표시하는 컴포넌트
 * 메인 이미지를 담당함
 * 레이지 로딩 적용
 */

import React from 'react';
import placeholderImage from "../../../../assets/images/placeholder.svg";
import { useLazyImage } from "../../../../hooks";
import {
  CardImageContainer,
  ImageGroup,
  MainCardImage,
  LoadingOverlay
} from './StoreImage.styles';

/**
 * StoreImage 컴포넌트
 * @param {Object} store - 가게 정보 객체
 * @param {string} store.id - 가게 ID
 * @param {string} store.name - 가게 이름 (alt 텍스트용)
 */
const StoreImage = ({ storeSrc, storeName, storeId }) => {
  // 레이지 로딩 훅 사용
  const { imageSrc, isLoading, hasError, imageRef } = useLazyImage(
    storeSrc,
    placeholderImage,
    {
      threshold: 0.1,
      rootMargin: '100px' // 100px 전에 미리 로드
    }
  );

  // 에러 발생 시 플레이스홀더 이미지 사용
  const finalImageSrc = hasError ? placeholderImage : imageSrc;

  return (
    <CardImageContainer>
      <ImageGroup ref={imageRef}>
        <MainCardImage
          src={finalImageSrc}
          alt={`${storeName} 메인 이미지`}
          onError={(e) => {
            console.warn(`이미지 로드 실패: ${storeId}, using fallback`);
            e.target.src = placeholderImage;
          }}
        />
        {/* 로딩 중 오버레이 */}
        {isLoading && (
          <LoadingOverlay>
            <div className="loading-spinner"></div>
          </LoadingOverlay>
        )}
      </ImageGroup>
    </CardImageContainer>
  );
};

export default StoreImage; 