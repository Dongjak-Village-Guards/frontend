export const fetchAddressResults = async (keyword) => {
    const API_KEY = process.env.REACT_APP_JUSO_API_KEY; // .env 파일에 있음
    const url = `https://business.juso.go.kr/addrlink/addrLinkApi.do?confmKey=${API_KEY}&currentPage=1&countPerPage=30&keyword=${encodeURIComponent(keyword)}&resultType=json`;

    /** Debugging Log(API 키 호출 여부, 키 확인) 
     console.log('API 호출 URL:', url); 
     console.log('API 키 확인:', API_KEY ? '있음' : '없음');
     */

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('API 호출 실패');
        const data = await response.json();
        return data.results?.juso || [];
    } catch (error) {
        console.error('주소 검색 오류:', error);
        return [];        
    }
};