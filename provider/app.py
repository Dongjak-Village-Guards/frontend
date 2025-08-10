import streamlit as st
import pandas as pd
from datetime import datetime, timedelta

# -----------------------------
# 설정
# -----------------------------
st.set_page_config(page_title="로그인 데모", page_icon="🔐", layout="wide")

# 데모용 로컬 사용자 DB (실서비스에선 백엔드 인증 API를 호출하세요)
LOCAL_USERS = {
    "supplier1": {"password": "pass1234", "role": "supplier"},
    "admin": {"password": "admin1234", "role": "admin"},
}

# 백엔드 인증 API를 쓰고 싶다면 아래 주석을 참고:
# AUTH_API = f"{st.secrets['api']['base_url']}/v1/auth/login"
# import requests
# def verify_with_backend(username, password):
#     r = requests.post(AUTH_API, json={"username": username, "password": password}, timeout=8)
#     r.raise_for_status()
#     return r.json()["access_token"]

# -----------------------------
# 유틸/상태 초기화
# -----------------------------
def init_state():
    st.session_state.setdefault("auth", False)
    st.session_state.setdefault("user", None)
    st.session_state.setdefault("page", "login")  # login | dashboard

init_state()

def do_logout():
    for k in ("auth", "user", "page", "token"):
        if k in st.session_state:
            del st.session_state[k]
    init_state()
    st.success("로그아웃 되었습니다.")
    st.rerun()

# -----------------------------
# 로그인 뷰
# -----------------------------
def view_login():
    st.title("🔐 로그인")
    st.caption("데모용: supplier1 / pass1234 or admin / admin1234")

    with st.form("login_form", clear_on_submit=False):
        username = st.text_input("아이디", value="", key="login_username")
        password = st.text_input("비밀번호", type="password", value="", key="login_password")
        keep = st.checkbox("로그인 유지", value=True)
        submitted = st.form_submit_button("로그인")

    if submitted:
        # 1) 백엔드 인증을 사용하는 경우
        # try:
        #     token = verify_with_backend(username, password)
        #     st.session_state["auth"] = True
        #     st.session_state["user"] = {"username": username, "role": "supplier"}
        #     st.session_state["token"] = token
        #     st.session_state["page"] = "dashboard"
        #     st.rerun()
        # except Exception as e:
        #     st.error(f"로그인 실패: {e}")

        # 2) 데모용 로컬 검증
        user = LOCAL_USERS.get(username)
        if user and user["password"] == password:
            st.session_state["auth"] = True
            st.session_state["user"] = {"username": username, "role": user["role"], "keep": keep}
            st.session_state["page"] = "dashboard"
            st.success("로그인 성공! 잠시 후 이동합니다…")
            st.rerun()
        else:
            st.error("아이디 또는 비밀번호가 올바르지 않습니다.")

# -----------------------------
# 대시보드 뷰 (로그인 후)
# -----------------------------
def view_dashboard():
    user = st.session_state.get("user") or {}
    st.title("📊 공급자 대시보드")
    st.caption(f"안녕하세요, **{user.get('username','?')}** 님!")

    top = st.columns([1, 1, 1, 2])
    with top[0]:
        st.metric("오늘 매출", "1,230,000원", "+3.5%")
    with top[1]:
        st.metric("주문 수", "128건", "+12")
    with top[2]:
        st.metric("재고 경고 품목", "3개", "-1")
    with top[3]:
        st.button("로그아웃", on_click=do_logout)

    st.divider()
    st.subheader("최근 주문")
    # 데모 데이터
    now = datetime.now()
    df = pd.DataFrame({
        "주문ID": [f"ORD-{i:04d}" for i in range(101, 111)],
        "상품": ["식빵", "쿠키", "케이크", "샌드위치", "커피", "샐러드", "라떼", "마카롱", "스콘", "주스"],
        "수량": [1,2,1,3,2,1,2,4,2,1],
        "금액(원)": [4500, 6000, 28000, 12000, 5000, 8500, 5500, 12000, 4000, 5200],
        "주문시각": [now - timedelta(minutes=10*i) for i in range(10)]
    })
    st.dataframe(df, use_container_width=True)

# -----------------------------
# 라우팅
# -----------------------------
def main():
    if not st.session_state["auth"]:
        st.session_state["page"] = "login"
        view_login()
    else:
        st.session_state["page"] = "dashboard"
        view_dashboard()

if __name__ == "__main__":
    main()
