export const fetchAddressResults = async (keyword, page = 1, pageSize = 7) => {
  const API_KEY = process.env.JUSO_API_KEY;
  const url = `https://business.juso.go.kr/addrlink/addrLinkApi.do?confmKey=${API_KEY}&currentpage=${page}&countPerPage=${pageSize}&keyword=${encodeURIComponent(keyword)}&resultType=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('API 호출 실패');
    const data = await response.json();
    return {
      results: data.results?.juso || [],
      totalCount: data.results?.common?.totalCount || 0, // 총 개수 확인
    };
  } catch (error) {
    console.error('주소 검색 오류:', error);
    return { results: [], totalCount: 0 };
  }
};