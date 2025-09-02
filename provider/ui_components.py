import streamlit as st
import pandas as pd
import math
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from api_functions import (
    api_login, fetch_user_info, fetch_timeline_data, 
    fetch_stats_data, api_update_slot_status, api_cancel_reservation
)
from state import sync_cache_from_session
from state import get_cache

# 리팩터링용 함수
def format_delta(value):
    return "0%" if value == "-" else f"{value}%"

def render_login_page():
    st.title("🔐 공급자 대시보드 로그인")
    # 폼을 placeholder로 감싸서 제출 시 즉시 제거
    placeholder = st.empty()
    with placeholder.form("login_form", clear_on_submit=True):
        email = st.text_input("이메일")
        password = st.text_input("비밀번호", type="password")
        submitted = st.form_submit_button("로그인")

    if submitted:
        # 폼 UI 즉시 제거 → 잔상 방지
        placeholder.empty()

        with st.spinner("로그인 중..."):
            if api_login(email, password):
                st.session_state['logged_in'] = True
                ok = fetch_user_info()  # store_id, store_name 채우기
                if not ok:
                    # 실패 시 로그인 상태 되돌리고 메시지
                    st.session_state['logged_in'] = False
                    st.error("로그인은 성공했으나, 가게 정보를 가져오는데 실패했습니다.")
                    # 폼 다시 표시
                    placeholder = st.empty()
                    with placeholder.form("login_form", clear_on_submit=True):
                        email = st.text_input("이메일")
                        password = st.text_input("비밀번호", type="password")
                        st.form_submit_button("로그인")
                    return

                # 성공 시 캐시에 반영 후 새로고침
                sync_cache_from_session()
                st.rerun()

        # rerun 직후 그 외 요소가 그려지는 걸 차단
        st.stop()

def render_slot_grid(slots):
    if not slots: 
        return
    
    # CSS 스타일 추가
    st.markdown("""
    <style>
    .slot-container {
        border: 2px solid #e0e0e0;
        border-radius: 10px;
        padding: 10px;
        margin: 5px;
        background: white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .slot-time {
        font-weight: bold;
        font-size: 16px;
        text-align: center;
        margin-bottom: 8px;
        color: #1f77b4;
    }
    .reserved-info {
        background: #e3f2fd;
        border-radius: 8px;
        padding: 8px;
        margin: 5px 0;
    }
    .user-email {
        font-size: 12px;
        color: #666;
        word-break: break-all;
        margin-bottom: 5px;
    }
    .menu-name {
        font-size: 14px;
        font-weight: 500;
        color: #333;
        margin-bottom: 8px;
    }
    .status-available {
        background: #e8f5e8;
        border-radius: 8px;
        padding: 8px;
        text-align: center;
        color: #2e7d32;
        font-weight: 500;
    }
    .status-manual {
        background: #fff3e0;
        border-radius: 8px;
        padding: 8px;
        text-align: center;
        color: #f57c00;
        font-weight: 500;
    }
    </style>
    """, unsafe_allow_html=True)
    
    for i in range(0, len(slots), 6):
        part_of_slots = slots[i:i+6]
        cols = st.columns(6)
        for j, slot in enumerate(part_of_slots):
            with cols[j]:
                # 시간 표시
                st.markdown(f'<div class="slot-time">{slot.get("time", "-")}</div>', unsafe_allow_html=True)
                
                if slot.get('is_reserved'):
                    if slot.get('reservation_info'):
                        info = slot.get('reservation_info', {})
                        
                        # 이메일을 도메인 부분만 표시
                        email = info.get('user_email', '')
                        if email and '@' in email:
                            username, domain = email.split('@')
                            display_email = f"{username[:3]}***@{domain}"
                        else:
                            display_email = email or '예약'
                        
                        # 예약 정보를 카드 형태로 표시
                        with st.container():
                            st.markdown(f'''
                            <div class="reserved-info">
                                <div class="user-email">👤 {display_email}</div>
                                <div class="menu-name">🏷️ {info.get('menu_name', '-')}</div>
                            </div>
                            ''', unsafe_allow_html=True)
                        
                        # 취소 버튼
                        if st.button("❌ 취소", key=f"cancel_{slot.get('slot_id')}", 
                                   use_container_width=True, type="secondary"):
                            if api_cancel_reservation(slot.get('slot_id'), info.get('reservation_id')):
                                st.success("✅ 취소 완료!")
                                st.rerun()
                            else: 
                                st.error("❌ 취소 실패")
                    else:
                        # 수동 마감 상태
                        st.markdown('<div class="status-manual">🔒 수동 마감</div>', unsafe_allow_html=True)
                        
                        if st.button("🔓 열기", key=f"open_{slot.get('slot_id')}", 
                                   use_container_width=True, type="primary"):
                            if api_update_slot_status(slot.get('slot_id'), "open"): 
                                st.success("✅ 다시 열림!")
                                st.rerun()
                            else: 
                                st.error("❌ 처리 실패")
                else:
                    # 예약 가능 상태
                    st.markdown('<div class="status-available">✅ 예약 가능</div>', unsafe_allow_html=True)
                    
                    if st.button("🔒 마감", key=f"close_{slot.get('slot_id')}", 
                               use_container_width=True, type="secondary"):
                        if api_update_slot_status(slot.get('slot_id'), "close"): 
                            st.success("✅ 마감 처리!")
                            st.rerun()
                        else: 
                            st.error("❌ 처리 실패")

def render_dashboard():
    st.set_page_config(layout="wide")
    st.sidebar.success(f"**{st.session_state.get('store_name', '가게')}**(으)로 로그인 됨")
    
    # 새로고침 버튼을 사이드바에 추가
    st.sidebar.markdown("---")
    if st.sidebar.button("🔄 새로고침", use_container_width=True, type="primary"):
        st.rerun()
    
    if st.sidebar.button("로그아웃"):
        # 1) 캐시를 먼저 비활성화
        cache = get_cache()
        cache["logged_in"] = False
        cache["access_token"] = None
        cache["refresh_token"] = None
        cache["store_id"] = None
        cache["store_name"] = None
        cache["headers"] = None

        # 2) 세션도 정리
        for k in ("logged_in", "access_token", "refresh_token", "store_id", "store_name", "headers"):
            if k in st.session_state:
                del st.session_state[k]

        # 3) 새로고침 → 메인 진입 시 캐시 값(False/None)로 복원 → 로그인 페이지 노출
        st.rerun()
            
    st.title("📊 공급자 대시보드")
    tab1, tab2 = st.tabs(["실시간 예약 관리", "성과 분석 및 통계"])

    with tab1:
        # 헤더 섹션
        st.markdown("""
        <div style="background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); 
                    padding: 20px; border-radius: 15px; color: white;">
            <h3 style="margin: 0; color: white;">📅 실시간 예약 현황 관리</h3>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">수동으로 예약을 취소하고, 마감할 수 있습니다.</p>
        </div>
        """, unsafe_allow_html=True)

        st.markdown("<br>", unsafe_allow_html=True)

        timeline_data = fetch_timeline_data(st.session_state.get('store_id'))

        if timeline_data:
            KST = ZoneInfo("Asia/Seoul")
            _today = datetime.now(KST).date()
            _tomorrow = _today + timedelta(days=1)

            today_tab, tomorrow_tab = st.tabs([f"📅 오늘 ({_today:%Y-%m-%d})", f"📅 내일 ({_tomorrow:%Y-%m-%d})"])
            
            with today_tab:
                if timeline_data.get('today') and timeline_data['today'].get('spaces'):
                    for space_info in timeline_data['today']['spaces']:
                        # Space 정보를 카드 형태로 표시
                        st.markdown(f"""
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; 
                                    border-left: 5px solid #007bff; margin: 15px 0;">
                            <h4 style="margin: 0; color: #007bff;"> {space_info.get('space_name')}</h4>
                        </div>
                        """, unsafe_allow_html=True)
                        render_slot_grid(space_info.get('slots', []))
                else: 
                    st.info("📝 오늘의 해당 시간대에 표시할 예약 현황이 없습니다.")
            
            with tomorrow_tab:
                if timeline_data.get('tomorrow') and timeline_data['tomorrow'].get('spaces'):
                    for space_info in timeline_data['tomorrow']['spaces']:
                        # Space 정보를 카드 형태로 표시
                        st.markdown(f"""
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; 
                                    border-left: 5px solid #28a745; margin: 15px 0;">
                            <h4 style="margin: 0; color: #28a745;"> {space_info.get('space_name')}</h4>
                        </div>
                        """, unsafe_allow_html=True)
                        render_slot_grid(space_info.get('slots', []))
                else: 
                    st.info("📝 내일의 해당 시간대에 표시할 예약 현황이 없습니다.")
        else: 
            st.error("⚠️ 타임라인 데이터를 불러오는 데 실패했습니다.")

    with tab2:
        # 헤더 섹션
        st.markdown("""
        <div style="background: linear-gradient(90deg, #ff6b6b 0%, #ee5a24 100%); 
                    padding: 20px; border-radius: 15px; color: white;">
            <h3 style="margin: 0; color: white;">📊 성과 분석 및 통계</h3>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">AI 기반 예약 시스템의 성과를 분석하고 인사이트를 제공합니다.</p>
        </div>
        """, unsafe_allow_html=True)

        st.markdown("<br>", unsafe_allow_html=True)

        # 기간 선택을 더 예쁘게
        col1, col2 = st.columns([2, 1])
        with col1:
            period_option = st.selectbox(
                "📅 분석 기간을 선택하세요",
                ["최근 7일", "최근 30일"],
                help="분석할 기간을 선택하면 해당 기간의 데이터를 시각화합니다."
            )
        with col2:
            st.markdown("<br>", unsafe_allow_html=True)

        selected_period = 7 if period_option == "최근 7일" else 30
        stats_data = fetch_stats_data(st.session_state.get('store_id'), selected_period)

        if stats_data:
            # KPI 섹션을 더 예쁘게
            st.markdown("""
            <div style="background: #f8f9fa; padding: 20px; border-radius: 15px; margin: 20px 0;">
                <h4 style="margin: 0 0 15px 0; color: #495057; text-align: center;">🎯 핵심 성과 지표 (KPI)</h4>
            </div>
            """, unsafe_allow_html=True)
            
            kpi_cols = st.columns([1.6, 1.6, 1.6])
            
            # 매출 KPI
            with kpi_cols[0]:
                st.markdown("""
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                            padding: 15px; border-radius: 10px; color: white; text-align: center;">
                    <h5 style="margin: 0 0 10px 0; font-size: 14px;">💰 AI가 만든 총매출</h5>
                </div>
                """, unsafe_allow_html=True)
                total_rev = stats_data.get('total_revenue', {}).get('value', 0)
                st.metric(
                    label="",
                    value=f"{total_rev:,}",                                   # 숫자만
                    delta=format_delta(stats_data.get('total_revenue', {}).get('delta', 0)),
                    help=f"{total_rev:,} 원"                                   # 단위는 help로
                )

            # 예약 수 KPI
            with kpi_cols[1]:
                st.markdown("""
                <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); 
                            padding: 15px; border-radius: 10px; color: white; text-align: center;">
                    <h5 style="margin: 0 0 10px 0; font-size: 14px;">📈 AI 총 예약 수</h5>
                </div>
                """, unsafe_allow_html=True)
                total_res = stats_data.get('total_reservations_count', {}).get('value', 0)
                st.metric(
                    label="",
                    value=f"{total_res:,}",                                    # 숫자만
                    delta=format_delta(stats_data.get('total_reservations_count', {}).get('delta', 0)),
                    help=f"{total_res:,} 건"                                   # 단위는 help로
                )

            # 할인 지출액 KPI
            with kpi_cols[2]:
                st.markdown("""
                <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); 
                            padding: 15px; border-radius: 10px; color: white; text-align: center;">
                    <h5 style="margin: 0 0 10px 0; font-size: 14px;">🎁 총 할인액</h5>
                </div>
                """, unsafe_allow_html=True)
                total_disc = stats_data.get('total_discount_amount', {}).get('value', 0)
                st.metric(
                    label="",
                    value=f"{total_disc:,}",                                   # 숫자만
                    help=f"{total_disc:,} 원"                                  # 단위는 help로
                )

            st.markdown("<br>", unsafe_allow_html=True)


            st.markdown("---")
            st.subheader("🤖 AI 분석 리포트")
            ai_analysis = stats_data.get('time_idx_and_discount_rate', [])
            
            if ai_analysis:
                df = pd.DataFrame(ai_analysis)
                
                # [수정됨] 선 그래프로 시각화
                st.write("##### 할인율에 따른 예약 분포")
                if not df.empty and 'discount_rate' in df.columns:
                    df_filtered = df.dropna(subset=['discount_rate'])
                    if not df_filtered.empty:
                        vals = pd.to_numeric(df_filtered['discount_rate'], errors='coerce').dropna()
                        if not vals.empty and vals.max() <= 1:
                            vals = vals * 100  # 0~1 → %

                        step = 5
                        max_val = float(vals.max()) if not vals.empty else 0.0
                        end = int(math.ceil(max_val / step) * step)            # 최댓값 경계까지
                        end = max(end, step)                                   # 최소 0~5는 보장
                        bins = list(range(0, end + step, step))                # 0,5,10,...,end

                        # 빈 구간 포함해 전 구간을 만들고, 그 순서를 보존
                        categories = pd.IntervalIndex.from_breaks(bins, closed='left')
                        groups = pd.cut(vals, bins=categories, right=False, include_lowest=True)
                        discount_counts = groups.value_counts().reindex(categories, fill_value=0)

                        # 라벨을 "00–05%" 같은 0채움으로 만들어 사전식 정렬 문제 해결
                        labels = [f"{int(iv.left):02d}–{int(iv.right):02d}%" for iv in discount_counts.index]
                        discount_counts.index = labels  # 이 순서 그대로 사용됨

                        st.line_chart(discount_counts)
                                                
                st.write("##### 잔여 시간에 따른 예약 분포")
                if not df.empty and 'time_offset_idx' in df.columns:
                    df_filtered = df.dropna(subset=['time_offset_idx'])
                    if not df_filtered.empty:
                        # 1칸 = 10분 → 분 단위로 변환
                        minutes = (
                            pd.to_numeric(df_filtered['time_offset_idx'], errors='coerce')
                            .dropna()
                            .astype(int) * 10
                        )
                    # 0~720분, 60분 간격으로 구간화
                    bins = list(range(0, 721, 60))
                    groups = pd.cut(minutes, bins=bins, right=False, include_lowest=True)

                    # 구간별 개수 집계 (IntervalIndex 그대로 정렬)
                    time_counts = groups.value_counts().sort_index()

                    # ❗️문자 라벨로 바꾸지 말고, x축은 숫자(구간 왼쪽 경계 분)로 사용
                    left_edges = [int(iv.left) for iv in time_counts.index]
                    series_numeric_x = pd.Series(time_counts.values, index=left_edges).sort_index()

                    st.line_chart(series_numeric_x, use_container_width=True)
                else:
                    st.write("AI 분석 리포트 데이터가 없습니다.")
            # 수요 분석 섹션을 더 예쁘게
            st.markdown("""
            <div style="background: #f8f9fa; padding: 20px; border-radius: 15px; margin: 20px 0;">
                <h4 style="margin: 0 0 15px 0; color: #495057; text-align: center;">📊 수요 분석 및 트렌드</h4>
            </div>
            """, unsafe_allow_html=True)

            # 시간대별 예약 분포
            st.markdown("""
            <div style="background: white; padding: 20px; border-radius: 10px; border: 1px solid #e9ecef; margin: 15px 0;">
                <h5 style="margin: 0 0 15px 0; color: #495057;">🕐 시간대별 예약 분포</h5>
                <p style="margin: 0 0 15px 0; color: #6c757d; font-size: 14px;">24시간 동안의 예약 패턴을 분석하여 최적의 운영 시간을 파악할 수 있습니다.</p>
            </div>
            """, unsafe_allow_html=True)

            hourly_data = stats_data.get('hourly_statistics')
            if hourly_data:
                s = pd.Series(hourly_data, dtype='int64')
                s.index = s.index.astype(int)                  # "0"~"23" -> 0~23
                s = s.reindex(range(24), fill_value=0).sort_index()

                df = s.reset_index()
                df.columns = ["hour", "count"]

                ymax = int(df["count"].max())
                if ymax == 0:
                    ytop, yvals = 1, [0, 1]                    # 전부 0이어도 축 보이게
                else:
                    ystep = max(1, math.ceil(ymax / 5))        # 대략 5칸
                    ytop = ((ymax + ystep - 1) // ystep) * ystep
                    yvals = list(range(0, ytop + 1, ystep))

                chart_container = st.container()
                with chart_container:
                    st.vega_lite_chart(
                        df,
                        {
                            "mark": {"type": "bar"},
                            "encoding": {
                                # x축 라벨 0° (가로로)
                                "x": {
                                    "field": "hour",
                                    "type": "ordinal",
                                    "axis": {"labelAngle": 0, "title": None}
                                },
                                # y축 정수 눈금만
                                "y": {
                                    "field": "count",
                                    "type": "quantitative",
                                    "scale": {"domain": [0, ytop]},
                                    "axis": {"title": "예약 건수", "values": yvals}
                                },
                                "tooltip": [
                                    {"field": "hour", "title": "시간"},
                                    {"field": "count", "title": "예약 건수"}
                                ],
                            },
                            "height": 260,
                        },
                        use_container_width=True,
                    )
                # 시간대별 요약 정보
                max_hour = s.idxmax()
                min_hour = s.idxmin()
                st.info(f"📊 **피크 시간**: {max_hour}시 ({s[max_hour]}건), **저조 시간**: {min_hour}시 ({s[min_hour]}건)")
            
            # 인기 메뉴 분석
            st.markdown("""
            <div style="background: white; padding: 20px; border-radius: 10px; border: 1px solid #e9ecef; margin: 15px 0;">
                <h5 style="margin: 0 0 15px 0; color: #495057;">🍽️ 인기 메뉴 분석</h5>
                <p style="margin: 0 0 15px 0; color: #6c757d; font-size: 14px;">고객들이 가장 선호하는 메뉴와 서비스를 파악하여 마케팅 전략을 수립할 수 있습니다.</p>
            </div>
            """, unsafe_allow_html=True)
            
            demand_data = stats_data.get('menu_statistics')
            if demand_data:
                space_df = pd.DataFrame(demand_data).set_index("name")
                # 차트를 더 예쁘게 표시
                chart_col1, chart_col2 = st.columns([2, 1])

                first_col = space_df.columns[0]
                series_all = pd.to_numeric(space_df[first_col], errors="coerce").fillna(0)
                top_series = series_all.sort_values(ascending=False).head(3)

                items = [(name, int(val)) for name, val in top_series.items()]
                while len(items) < 3:
                    items.append(("", 0))  # 빈 슬롯

                chart_df = pd.DataFrame(items, columns=["메뉴", "건수"])
                ymax = max(5, int(chart_df["건수"].max() * 1.2))  # 여백 있는 상한

                with chart_col1:
                    st.vega_lite_chart(
                        chart_df,
                        {
                            "mark": {"type": "bar", "orient": "vertical", "size": 40},  # 세로 막대 + 고정 두께
                            "encoding": {
                                # 데이터 순서를 그대로 유지 (정렬하지 않음)
                                "x": {"field": "메뉴", "type": "nominal", "sort": None,
                                    "axis": {"title": None, "labelAngle": 0}},
                                "y": {"field": "건수", "type": "quantitative",
                                    "scale": {"domain": [0, ymax]},
                                    "axis": {"title": None}},
                                "tooltip": [{"field": "메뉴"}, {"field": "건수"}],
                            },
                            "height": 220,
                        },
                        use_container_width=True,
                    )

                with chart_col2:
                    st.markdown("""
                    <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; border-left: 4px solid #2196f3;">
                        <h6 style="margin: 0 0 10px 0; color: #1976d2;">📈 인기 메뉴 순위 (Top 3)</h6>
                    </div>
                    """, unsafe_allow_html=True)

                    # 실제 데이터만 순위로 표시 (빈 슬롯 제외)
                    if not top_series.empty:
                        for i, (menu_name, cnt) in enumerate(top_series.items(), 1):
                            st.markdown(f"""
                            <div style="background: white; padding: 8px; border-radius: 5px; margin: 5px 0; 
                                        border-left: 3px solid #2196f3;">
                                <span style="font-weight: bold; color: #1976d2;">#{i}</span> 
                                <span style="margin-left: 10px;">{menu_name}</span>
                                <span style="float: right; color: #666;">{int(cnt):,}건</span>
                            </div>
                            """, unsafe_allow_html=True)
                    else:
                        st.info("표시할 메뉴 데이터가 없습니다.")