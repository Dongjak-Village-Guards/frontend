def _get_api_base_url():
    try:
        import streamlit as st
        v = st.secrets.get("api", {}).get("BASE_URL")
        if v:
            return v
    except Exception:
        pass
    
    raise RuntimeError("API_BASE_URL is not set in Streamlit secrets or env")

API_BASE_URL = _get_api_base_url()