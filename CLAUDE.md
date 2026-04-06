# 밸런스게임 (balancegame)

앱인토스 미니앱. 전체 계획서: ~/appintoss/docs/appintoss_plan.md §5-①

## 앱 정보
- appName: `balancegame`
- displayName: `밸런스게임` (granite.config.ts = 콘솔 = index.html title 동일 필수)
- primaryColor: `#E85D04`
- port: 5178

## 핵심 기능
- 날짜 기반 결정론적으로 오늘의 질문 5개 선택
- 연속 참여 스트릭 (storage 기반)
- 질문별 참여자 비율 결과 화면
- 전면형 광고: 결과 화면 진입 전

## 주의사항
- 자체 뒤로가기 버튼 구현 금지
- TDS 컴포넌트만 사용 (`@toss/tds-mobile`)
- 광고는 테스트 ID 사용 중인지 확인 후 운영 ID로 교체
