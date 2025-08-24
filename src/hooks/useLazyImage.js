/**
 * 이미지 레이지 로딩을 위한 커스텀 훅
 * Intersection Observer API를 사용하여 뷰포트에 진입할 때만 이미지를 로드
 */

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useLazyImage 훅
 * @param {string} src - 로드할 이미지 URL
 * @param {string} placeholder - 플레이스홀더 이미지 URL
 * @param {Object} options - 옵션 설정
 * @param {number} options.threshold - 뷰포트 진입 임계값 (0-1, 기본값: 0.1)
 * @param {string} options.rootMargin - 뷰포트 마진 (기본값: '50px')
 * @returns {Object} { imageSrc, isLoading, hasError, imageRef }
 */
const useLazyImage = (src, placeholder, options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '50px'
  } = options;

  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imageRef = useRef(null);

  const loadImage = useCallback(() => {
    if (!src || imageSrc === src) return;

    setIsLoading(true);
    setHasError(false);

    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };

    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
      console.warn(`이미지 로드 실패: ${src}`);
    };

    // 이미지 로드 시작
    img.src = src;
  }, [src, imageSrc]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadImage();
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, [loadImage, threshold, rootMargin]);

  return {
    imageSrc,
    isLoading,
    hasError,
    imageRef
  };
};

export default useLazyImage; 