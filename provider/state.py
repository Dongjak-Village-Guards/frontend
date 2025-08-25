# state.py
import streamlit as st

@st.cache_resource
def get_cache():
    return {
        "logged_in": False,
        "access_token": None,
        "refresh_token": None,
        "store_id": None,
        "store_name": None,
        "headers": None,
    }

def sync_session_from_cache():
    """앱 시작 시 세션 비어있으면 캐시값으로 복원"""
    cache = get_cache()
    for k, v in cache.items():
        if k not in st.session_state or st.session_state.get(k) is None:
            st.session_state[k] = v

def sync_cache_from_session():
    """로그인/토큰 갱신 후 세션값을 캐시에 반영"""
    cache = get_cache()
    for k in ("logged_in", "access_token", "refresh_token", "store_id", "store_name", "headers"):
        if k in st.session_state:
            cache[k] = st.session_state.get(k)
