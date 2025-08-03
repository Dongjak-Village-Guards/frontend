export const fetchAddressResults = async (keyword) => {
    const API_KEY = process.env.REACT_APP_JUSO_API_KEY; // .env 파일에 있음
    const url = `https://business.juso.go.kr/addrlink/addrLinkApi.do?confmKey=${API_KEY}&currentPage=1&countPerPage=30&keyword=${encodeURIComponent(keyword)}&resultType=json`;

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