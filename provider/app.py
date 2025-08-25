import streamlit as st
from ui_components import render_login_page, render_dashboard
from state import sync_session_from_cache


#  앱 시작 시 캐시 → 세션 복원
sync_session_from_cache()

if 'logged_in' not in st.session_state: 
    st.session_state['logged_in'] = False

if st.session_state.get('logged_in'):
    if 'store_id' in st.session_state and st.session_state.get('store_id') is not None:
        render_dashboard()
    else:
        st.error("가게 정보를 불러올 수 없습니다. 다시 로그인해주세요.")
        if st.button("로그인 페이지로 돌아가기"): 
            st.session_state.clear()
            from state import sync_cache_from_session
            sync_cache_from_session()  # 로그아웃 시 캐시도 정리
            st.rerun()  
else: 
    render_login_page()
