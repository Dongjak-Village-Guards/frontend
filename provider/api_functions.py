import streamlit as st
import requests
from config import API_BASE_URL
from state import get_cache, sync_cache_from_session

def api_login(email, password):
    """[실제] 백엔드에 로그인(POST)을 요청하고, 성공 시 토큰을 저장합니다."""
    API_URL = f"{API_BASE_URL}/accounts/login/owner/"
    try:
        response = requests.post(API_URL, json={"owner_email": email, "owner_password": password})
        if response.status_code == 200:
            data = response.json()
            st.session_state['access_token'] = data.get("access_token")
            st.session_state['refresh_token'] = data.get("refresh_token")
            return True
        else:
            st.error(f"로그인 실패: {response.json().get('message', '서버 응답 오류')}")
            return False
    except requests.exceptions.RequestException as e:
        st.error(f"API 연결 오류: {e}")
        return False
def get_auth_headers():
    token = st.session_state.get("access_token")

    # 세션에 없으면 캐시에서 복구
    if not token:
        cache = get_cache()
        token = cache.get("access_token")
        if token:
            st.session_state["access_token"] = token
            for k in ("refresh_token", "store_id", "store_name", "headers"):
                v = cache.get(k)
                if v is not None:
                    st.session_state[k] = v

    if not token:
        return None

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }

    st.session_state["headers"] = headers
    sync_cache_from_session()   # 캐시 동기화
    return headers

def fetch_user_info():
    """[실제] '내 정보 조회' API를 호출하여 가게 ID와 이름을 가져옵니다."""
    API_URL = f"{API_BASE_URL}/stores/me/owner/"
    headers = get_auth_headers()
    if not headers: return False
    try:
        response = requests.get(API_URL, headers=headers)
        if response.status_code == 200:
            user_data = response.json()
            st.session_state['store_id'] = user_data.get("store_id")
            st.session_state['store_name'] = user_data.get("store_name")
            return True
        else: return False
    except requests.exceptions.RequestException: 
        return False

def fetch_timeline_data(store_id):
    """[실제] 백엔드에 시간 인덱스 목록(POST)을 보내 타임라인 데이터를 요청합니다."""
    API_URL = f"{API_BASE_URL}/reservations/me/owner/{store_id}"
    headers = get_auth_headers()
    if not headers: 
        st.error("헤더가 없습니다. 헤더 연결을 확인하세요.")
        return None
    
    if not store_id:
        st.error("store_id가 없습니다. 로그인/가게 연결을 확인하세요.")
        return None
    
    try:
        response = requests.get(API_URL, headers=headers)
        if response.status_code == 200: 
            return response.json()
        else: 
            return None
    except requests.exceptions.RequestException: 
        return None

def fetch_stats_data(store_id, day):
    """[실제] 백엔드에 기간(GET)을 보내 성과 통계 데이터를 요청합니다."""
    API_URL = f"{API_BASE_URL}/stores/{store_id}/{day}/stats"
    headers = get_auth_headers()
    if not headers: return None
    try:
        response = requests.get(API_URL, headers=headers)
        print(response.json())
        if response.status_code == 200: 

            return response.json()
        else: 
            return None
    except requests.exceptions.RequestException: 
        return None

def api_update_slot_status(slot_id, action):
    """[실제] 슬롯 상태를 변경(PATCH)합니다. (마감/열기)"""
    endpoint = "sold_out" if action == "close" else "restock"
    API_URL = f"{API_BASE_URL}/reservations/{slot_id}/{endpoint}/"
    headers = get_auth_headers()
    if not headers: 
        return False
    try:
        response = requests.patch(API_URL, headers=headers)
        return response.status_code == 200
    except requests.exceptions.RequestException: 
        return False

def api_cancel_reservation(slot_id, reservation_id):
    """[실제] 예약을 취소(DELETE)합니다."""
    API_URL = f"{API_BASE_URL}/reservations/{slot_id}/{reservation_id}/cancel/"
    headers = get_auth_headers()
    if not headers: return False
    try:
        response = requests.delete(API_URL, headers=headers)
        return response.status_code == 200
    except requests.exceptions.RequestException: 
        return False
