<img src="https://github.com/user-attachments/assets/48b42d72-aaa4-4b76-b3ce-0311e64e8795" />

<div align="center">
    <h3>서비스업의 공실 시간을 AI로 해결하는 하이퍼로컬 타임커머스 플랫폼 ⏰</h3>
    <h4>바로가기 → https://nowsale.netlify.app</h4>
</div>

> ### 목차
> 1. <a href="https://github.com/Dongjak-Village-Guards/frontend?tab=readme-ov-file#-team-%EB%8F%99%EC%9E%91%EB%A7%88%EC%9D%84%EB%B0%A9%EB%B2%94%EB%8C%80">팀 소개</a>
> 2. <a href="https://github.com/Dongjak-Village-Guards/frontend?tab=readme-ov-file#-%EA%B8%B0%ED%9A%8D-%EB%B0%B0%EA%B2%BD">기획 배경</a>
> 3. <a href="https://github.com/Dongjak-Village-Guards/frontend?tab=readme-ov-file#%EF%B8%8F-%ED%95%B5%EC%8B%AC-%EA%B8%B0%EC%88%A0">핵심 기술</a>
> 4. <a href="https://github.com/Dongjak-Village-Guards/frontend?tab=readme-ov-file#%EF%B8%8F-%ED%95%B5%EC%8B%AC-%EA%B8%B0%EC%88%A0">서비스 소개</a>

<div>
  <h1>👷🏻 Team 동작마을방범대</h1>
  <div align="center">
    <p>빠른 실행력과 대학생의 감각을 바탕으로<br>동작구 상권의 문제를 누구보다 깊게 이해하고 혁신적으로 해결하는 중앙대학교 IT 창업 팀입니다.</p>
    <table>
      <tr>
        <th>이민재</th>
        <th>조윤빈</th>
        <th>기태린</th>
        <th>정건</th>
        <th>최서영</th>
        <th>최지원</th>
      </tr>
      <tr>
        <td align="center">PM</td>
        <td align="center">DE</td>
        <td align="center">FE</td>
        <td align="center">FE</td>
        <td align="center">BE</td>
        <td align="center">BE</td>
      </tr>
      <tr>
        <td align="center">alswo6102@gmail.com</td>
        <td align="center">choyb16@naver.com</td>
        <td align="center"><a href="https://github.com/xaerinoo"/>@xaerinoo</a></td>
        <td align="center"><a href="https://github.com/gun587330"/>@gun587330</a></td>
        <td align="center"><a href="https://github.com/dallaechoi"/>@dallaechoi</a></td>
        <td align="center"><a href="https://github.com/ji-circle"/>@ji-circle</a></td>
      </tr>
    </table>
  </div>
</div>

<div>
  <h1>🧭 기획 배경</h1>
  <img src="https://github.com/user-attachments/assets/1ce8c6df-b17f-4a42-a328-ac177b06547c" />
  <p align="center">미용실, 카페, 스터디카페 등 많은 소상공인들은 예약 공백이나 마감 재고로 인해 <strong>손실</strong>을 겪지만, 이를 메울 마땅한 방법이 없습니다.<br>대형 프랜차이즈와 달리 개별 소상공인은 마케팅이나 가격 할인 프로모션을 기획할 여력도 부족합니다.</p>
  <p align="center">반면 동작구의 1인 가구와 학생들은 합리적인 소비와 동네 가게를 발견하고 싶은 <strong>욕구</strong>가 있지만, 신뢰할 수 있는 할인 정보를 실시간으로 얻기 어렵습니다.<br>이러한 문제를 해결하기 위해 AI 다이나믹 프라이싱 기반의 지역 상생 플랫폼을 기획했습니다.</p>
  <h3>"지금살래?"가 이끄는 변화 ✨</h3>
  <ul>
    <li>소상공인의 유휴 시간·재고를 수익으로 전환</li>
    <li>소비자에게 합리적인 가격으로 지역 서비스 제공</li>
    <li>AI 기술을 통해 소상공인과 소비자를 연결하는 지역 상생 파트너 지향</li>
    <li>동작구를 시작으로 지역 소상공인이 대형 프랜차이즈와 경쟁할 수 있는 디지털 생태계 구축</li>
  </ul>
</div>

<div>
  <h1>⚙️ 핵심 기술</h1>
  <p align="center">지난 2개월간 팀은 "지금살래?" 서비스의 핵심 기능을 모바일 웹을 통해 MVP 수준으로 구현하는 데 집중했습니다.</p>
  <img src="https://github.com/user-attachments/assets/4e0fdc9e-7a47-4b2a-95a6-749a12bcef1b" />
  <p align="center">먼저 동작구 소상공인을 대상으로 공실·예약 패턴을 조사하여 문제 정의를 구체화했고,<br>그 과정에서 공실 문제를 해결하는 관통 아이디어가 바로 <strong>AI 다이나믹 프라이싱</strong>이라는 점을 도출했습니다.<br>이를 실제로 적용하기 위해 로지스틱 회귀모델 기반 가격 산출 모델을 직접 구현하고, 초기 핵심 변수(예약 잔여 시간, 가격, 메뉴별 가중치)를 설계했습니다.</p>
  <table>
      <tr>
        <th>백엔드</th>
        <th>프론트엔드</th>
      </tr>
      <tr>
        <td align="center">예약 생성 API와 DB 구조를 완성하고, 크론탭을 활용한 24시간 주기 데이터 학습과 10분 단위 실시간 추론 로직을 구축</td>
        <td align="center">메인 리스트·상세페이지와 예약·결제 플로우를 구현하여 서비스 흐름을 완성</td>
      </tr>
  </table>
</div>

<div>
  <h1>📱 서비스 소개</h1>
  <img src="https://github.com/user-attachments/assets/a447793a-debe-438f-8a24-3423d1b12be2" />
</div>
