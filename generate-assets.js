/**
 * AIT Store Asset Generator
 * 출력: store-assets/ 폴더
 *
 * 생성 목록:
 *   logo_600x600.png          앱 로고 (라이트)
 *   logo_dark_600x600.png     앱 로고 (다크)
 *   thumbnail_1932x828.png    가로형 썸네일
 *   screen1_636x1048.png      세로 스크린샷 1 — 인트로
 *   screen2_636x1048.png      세로 스크린샷 2 — 게임 중
 *   screen3_636x1048.png      세로 스크린샷 3 — 결과
 *   screen4_landscape_1504x741.png  가로 스크린샷
 */

const sharp = require('sharp');
const path  = require('path');
const fs    = require('fs');

const OUT = path.join(__dirname, 'store-assets');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

async function render(svgContent, filename) {
  const buf = Buffer.from(svgContent, 'utf-8');
  await sharp(buf).png().toFile(path.join(OUT, filename));
  console.log('✓', filename);
}

/* ─── colors ─── */
const OR  = '#FF5C35';  // 음식 (orange)
const PK  = '#E91E8C';  // 연애 (pink)
const BL  = '#1A73E8';  // 직장 (blue)
const PU  = '#7B2FBE';  // 인생 (purple)
const GR  = '#00A878';  // 상상 (green)
const CR  = '#FAFAF7';  // cream bg
const DK  = '#111111';  // dark
const WH  = '#FFFFFF';
const PALE_OR = '#FFF3EF';
const SOFT_OR = '#FFE8E0';
const PALE_PU = '#F5F0FF';
const SOFT_PU = '#E2D4F8';
const LIGHT_GRAY = '#F7F7F5';
const BORDER     = '#EFEFEB';

/* ─── font stacks ─── */
// rsvg uses fontconfig — on macOS system fonts are available
const KR   = `'Apple SD Gothic Neo', 'Malgun Gothic', 'Noto Sans KR', sans-serif`;
const LAT  = `'Arial Black', 'Helvetica Neue', Arial, sans-serif`;

/* ══════════════════════════════════════════════════════════════════
   LOGO 600×600  (라이트)
   콘셉트: 진한 배경에 오렌지(A) · 퍼플(B) 두 패널 분할
   ══════════════════════════════════════════════════════════════════ */
const svgLogo = `<svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="600" fill="${DK}"/>
  <!-- Left panel: orange -->
  <rect x="0"   y="0" width="284" height="600" fill="${OR}"/>
  <!-- Right panel: purple -->
  <rect x="316" y="0" width="284" height="600" fill="${PU}"/>
  <!-- Center divider -->
  <rect x="284" y="0" width="32"  height="600" fill="${DK}"/>
  <!-- Letters -->
  <text x="142" y="390"
    font-family="${LAT}" font-weight="900" font-size="300"
    fill="${WH}" text-anchor="middle" dominant-baseline="alphabetic"
    letter-spacing="-10">A</text>
  <text x="458" y="390"
    font-family="${LAT}" font-weight="900" font-size="300"
    fill="${WH}" text-anchor="middle" dominant-baseline="alphabetic"
    letter-spacing="-10">B</text>
</svg>`;

/* ══════════════════════════════════════════════════════════════════
   LOGO 600×600  (다크) — 로고 자체가 이미 어두운 배경이므로 동일
   ══════════════════════════════════════════════════════════════════ */
const svgLogoDark = svgLogo;

/* ══════════════════════════════════════════════════════════════════
   THUMBNAIL 1932×828
   왼쪽: 헤드라인 + 카테고리 태그
   오른쪽: 게임 UI 미리보기 (음식 문제 예시)
   ══════════════════════════════════════════════════════════════════ */
const svgThumb = `<svg width="1932" height="828" viewBox="0 0 1932 828" xmlns="http://www.w3.org/2000/svg">
  <rect width="1932" height="828" fill="${DK}"/>

  <!-- subtle noise texture lines -->
  <line x1="0" y1="0" x2="1932" y2="828" stroke="white" stroke-width="0.3" opacity="0.03"/>
  <line x1="0" y1="828" x2="1932" y2="0" stroke="white" stroke-width="0.3" opacity="0.03"/>

  <!-- ── Left text ── -->
  <!-- App label -->
  <text x="80" y="188"
    font-family="${KR}" font-weight="700" font-size="28"
    fill="${OR}" letter-spacing="1">밸런스게임</text>

  <!-- Headline -->
  <text x="80" y="320"
    font-family="${KR}" font-weight="900" font-size="108"
    fill="${WH}" letter-spacing="-5">이건 진짜</text>
  <text x="80" y="448"
    font-family="${KR}" font-weight="900" font-size="108"
    fill="${WH}" letter-spacing="-5">고민된다.</text>

  <!-- Sub -->
  <text x="80" y="520"
    font-family="${KR}" font-weight="400" font-size="30"
    fill="rgba(255,255,255,0.45)" letter-spacing="-0.5">5가지 딜레마 · 선택이 당신을 말한다</text>

  <!-- Category pills -->
  <rect x="80"  y="568" width="120" height="44" rx="22" fill="${OR}" fill-opacity="0.18"/>
  <text x="140" y="596" font-family="${KR}" font-weight="700" font-size="20" fill="${OR}" text-anchor="middle">음식</text>
  <rect x="212" y="568" width="120" height="44" rx="22" fill="${PK}" fill-opacity="0.18"/>
  <text x="272" y="596" font-family="${KR}" font-weight="700" font-size="20" fill="${PK}" text-anchor="middle">연애</text>
  <rect x="344" y="568" width="120" height="44" rx="22" fill="${BL}" fill-opacity="0.18"/>
  <text x="404" y="596" font-family="${KR}" font-weight="700" font-size="20" fill="${BL}" text-anchor="middle">직장</text>
  <rect x="476" y="568" width="120" height="44" rx="22" fill="${PU}" fill-opacity="0.18"/>
  <text x="536" y="596" font-family="${KR}" font-weight="700" font-size="20" fill="${PU}" text-anchor="middle">인생</text>
  <rect x="608" y="568" width="120" height="44" rx="22" fill="${GR}" fill-opacity="0.18"/>
  <text x="668" y="596" font-family="${KR}" font-weight="700" font-size="20" fill="${GR}" text-anchor="middle">상상</text>

  <!-- ── Right: game preview card ── -->
  <rect x="1050" y="40" width="842" height="748" rx="28" fill="${CR}"/>

  <!-- A Panel (selected, orange, taller) -->
  <rect x="1066" y="56" width="810" height="400" rx="18 18 6 6" fill="${OR}"/>
  <!-- Question -->
  <text x="1100" y="138"
    font-family="${KR}" font-weight="900" font-size="40"
    fill="${WH}" letter-spacing="-1.5">평생 치킨 못 먹기</text>
  <!-- Percentage (big) -->
  <text x="1826" y="420"
    font-family="${LAT}" font-weight="900" font-size="148"
    fill="rgba(255,255,255,0.88)" text-anchor="end" letter-spacing="-10">67</text>
  <text x="1826" y="420"
    font-family="${LAT}" font-weight="900" font-size="80"
    fill="rgba(255,255,255,0.88)" text-anchor="end" dominant-baseline="alphabetic"
    dy="-8">%</text>

  <!-- VS divider -->
  <rect x="1066" y="456" width="810" height="30" fill="${CR}"/>
  <text x="1471" y="477"
    font-family="${LAT}" font-weight="800" font-size="13"
    fill="${OR}" text-anchor="middle" letter-spacing="4">VS</text>

  <!-- B Panel (not selected, faded) -->
  <rect x="1066" y="486" width="810" height="280" rx="6 6 18 18" fill="${SOFT_OR}" fill-opacity="0.55"/>
  <text x="1100" y="560"
    font-family="${KR}" font-weight="900" font-size="40"
    fill="${DK}" fill-opacity="0.38" letter-spacing="-1.5">평생 라면 못 먹기</text>

  <!-- Minority badge -->
  <rect x="1066" y="694" width="810" height="74" rx="16" fill="#F3EEFF"/>
  <circle cx="1110" cy="731" r="20" fill="${PU}" fill-opacity="0.18"/>
  <text x="1110" y="739"
    font-family="${LAT}" font-weight="900" font-size="18"
    fill="${PU}" text-anchor="middle">!</text>
  <text x="1144" y="726"
    font-family="${KR}" font-weight="900" font-size="20"
    fill="${PU}" letter-spacing="-0.5">33%만 이 선택</text>
  <text x="1144" y="752"
    font-family="${KR}" font-weight="500" font-size="15"
    fill="#9E7FD4" letter-spacing="-0.3">소수파예요 — 꽤 특이한 취향이네요</text>
</svg>`;

/* ══════════════════════════════════════════════════════════════════
   SCREENSHOT 1 — 인트로  636×1048
   ══════════════════════════════════════════════════════════════════ */
const svgS1 = `<svg width="636" height="1048" viewBox="0 0 636 1048" xmlns="http://www.w3.org/2000/svg">
  <rect width="636" height="1048" fill="${CR}"/>

  <!-- Decorative blobs (emoji-cloud substitute) -->
  <circle cx="80"  cy="135" r="46" fill="${OR}" fill-opacity="0.18"/>
  <circle cx="556" cy="100" r="36" fill="${PK}" fill-opacity="0.20"/>
  <circle cx="318" cy="240" r="72" fill="${BL}" fill-opacity="0.08"/>
  <circle cx="76"  cy="385" r="32" fill="${PU}" fill-opacity="0.16"/>
  <circle cx="560" cy="360" r="28" fill="${GR}" fill-opacity="0.18"/>
  <circle cx="420" cy="155" r="24" fill="${OR}" fill-opacity="0.12"/>

  <!-- Inner color circles -->
  <circle cx="80"  cy="135" r="28" fill="${OR}" fill-opacity="0.55"/>
  <circle cx="556" cy="100" r="22" fill="${PK}" fill-opacity="0.55"/>
  <circle cx="318" cy="240" r="44" fill="${BL}" fill-opacity="0.18"/>
  <circle cx="76"  cy="385" r="18" fill="${PU}" fill-opacity="0.45"/>
  <circle cx="560" cy="360" r="16" fill="${GR}" fill-opacity="0.45"/>

  <!-- Center icon: abstract A|B -->
  <rect x="268" y="196" width="64" height="88" rx="6" fill="${OR}"/>
  <rect x="304" y="196" width="64" height="88" rx="6" fill="${PU}"/>
  <rect x="298" y="196" width="12"  height="88" fill="${CR}"/>

  <!-- Fade bottom of blob area -->
  <defs>
    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="${CR}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${CR}" stop-opacity="1"/>
    </linearGradient>
  </defs>
  <rect y="320" width="636" height="260" fill="url(#g1)"/>

  <!-- ── Bottom copy ── -->
  <!-- Headline -->
  <text x="24" y="670"
    font-family="${KR}" font-weight="900" font-size="72"
    fill="${DK}" letter-spacing="-4">이건 진짜</text>
  <text x="24" y="756"
    font-family="${KR}" font-weight="900" font-size="72"
    fill="${DK}" letter-spacing="-4">고민된다.</text>

  <!-- Sub -->
  <text x="24" y="800"
    font-family="${KR}" font-weight="400" font-size="18"
    fill="#999" letter-spacing="-0.3">5가지 딜레마 · 나라면 어떻게 할까?</text>

  <!-- Filter row -->
  <text x="24" y="858"
    font-family="${KR}" font-weight="600" font-size="15"
    fill="#aaa" letter-spacing="-0.2">전체 카테고리  ▾</text>

  <!-- Start button -->
  <rect x="24" y="890" width="588" height="64" rx="16" fill="${DK}"/>
  <text x="318" y="930"
    font-family="${KR}" font-weight="800" font-size="18"
    fill="${WH}" text-anchor="middle" letter-spacing="-0.5">지금 시작하기</text>

  <!-- Status bar area -->
  <rect x="0" y="0" width="636" height="52" fill="${CR}"/>
  <text x="318" y="32"
    font-family="${LAT}" font-weight="600" font-size="17"
    fill="${DK}" text-anchor="middle">9:41</text>
</svg>`;

/* ══════════════════════════════════════════════════════════════════
   SCREENSHOT 2 — 게임 중 (음식, A 선택 후)  636×1048
   질문: "평생 치킨 못 먹기" vs "평생 라면 못 먹기"
   A 선택됨 → 오렌지 패널 커짐, 67% 표시, 소수 배지
   ══════════════════════════════════════════════════════════════════ */
const svgS2 = `<svg width="636" height="1048" viewBox="0 0 636 1048" xmlns="http://www.w3.org/2000/svg">
  <rect width="636" height="1048" fill="${CR}"/>

  <!-- Status bar -->
  <rect x="0" y="0" width="636" height="52" fill="${CR}"/>
  <text x="318" y="32"
    font-family="${LAT}" font-weight="600" font-size="17"
    fill="${DK}" text-anchor="middle">9:41</text>

  <!-- Nav -->
  <line x1="20" y1="72" x2="32" y2="62" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="20" y1="72" x2="32" y2="82" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>

  <!-- Progress bar -->
  <rect x="50" y="68" width="472" height="3" rx="2" fill="#E8E8E2"/>
  <rect x="50" y="68" width="188" height="3" rx="2" fill="${OR}"/>

  <!-- Category badge -->
  <rect x="532" y="56" width="90" height="30" rx="15" fill="${PALE_OR}"/>
  <text x="577" y="76"
    font-family="${KR}" font-weight="700" font-size="13"
    fill="${OR}" text-anchor="middle">음식</text>

  <!-- A Panel (selected, tall) -->
  <rect x="12" y="96" width="612" height="498" rx="20 20 6 6" fill="${OR}"/>

  <!-- Question text -->
  <text x="36" y="162"
    font-family="${KR}" font-weight="900" font-size="30"
    fill="${WH}" letter-spacing="-1">평생 치킨 못 먹기</text>

  <!-- Big % -->
  <text x="596" y="546"
    font-family="${LAT}" font-weight="900" font-size="116"
    fill="rgba(255,255,255,0.88)" text-anchor="end" letter-spacing="-8">67</text>
  <text x="596" y="546"
    font-family="${LAT}" font-weight="900" font-size="64"
    fill="rgba(255,255,255,0.88)" text-anchor="end" dominant-baseline="alphabetic"
    dy="-4">%</text>

  <!-- VS -->
  <rect x="12" y="594" width="612" height="30" fill="${CR}"/>
  <text x="318" y="614"
    font-family="${LAT}" font-weight="800" font-size="11"
    fill="${OR}" text-anchor="middle" letter-spacing="3">VS</text>

  <!-- B Panel (not selected, faded) -->
  <rect x="12" y="624" width="612" height="266" rx="6 6 20 20" fill="${SOFT_OR}" fill-opacity="0.5"/>
  <text x="36" y="690"
    font-family="${KR}" font-weight="900" font-size="30"
    fill="${DK}" fill-opacity="0.4" letter-spacing="-1">평생 라면 못 먹기</text>

  <!-- Minority badge -->
  <rect x="12" y="908" width="612" height="72" rx="14" fill="#F3EEFF"/>
  <circle cx="46" cy="944" r="18" fill="${PU}" fill-opacity="0.15"/>
  <text x="46" y="950"
    font-family="${LAT}" font-weight="900" font-size="16"
    fill="${PU}" text-anchor="middle">!</text>
  <text x="74" y="938"
    font-family="${KR}" font-weight="900" font-size="18"
    fill="${PU}" letter-spacing="-0.5">33%만 이 선택</text>
  <text x="74" y="962"
    font-family="${KR}" font-weight="500" font-size="13"
    fill="#9E7FD4" letter-spacing="-0.2">소수파예요 — 꽤 특이한 취향이네요</text>

  <!-- Buttons -->
  <rect x="12"  y="992" width="476" height="48" rx="14" fill="${OR}"/>
  <text x="250" y="1022"
    font-family="${KR}" font-weight="800" font-size="17"
    fill="${WH}" text-anchor="middle" letter-spacing="-0.5">다음 문제</text>

  <rect x="500" y="992" width="124" height="48" rx="14" fill="${BORDER}"/>
  <text x="562" y="1022"
    font-family="${KR}" font-weight="700" font-size="13"
    fill="#888" text-anchor="middle">이 질문 공유</text>
</svg>`;

/* ══════════════════════════════════════════════════════════════════
   SCREENSHOT 3 — 결과 화면  636×1048
   유형: 희귀 소수파 (4번 소수 선택)
   ══════════════════════════════════════════════════════════════════ */
const svgS3 = `<svg width="636" height="1048" viewBox="0 0 636 1048" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="sh">
      <feDropShadow dx="0" dy="4" stdDeviation="12" flood-color="rgba(0,0,0,0.09)"/>
    </filter>
  </defs>
  <rect width="636" height="1048" fill="${CR}"/>

  <!-- Status bar -->
  <rect x="0" y="0" width="636" height="52" fill="${CR}"/>
  <text x="318" y="32"
    font-family="${LAT}" font-weight="600" font-size="17"
    fill="${DK}" text-anchor="middle">9:41</text>

  <!-- Result Card -->
  <rect x="16" y="56" width="604" height="692" rx="24" fill="${WH}" filter="url(#sh)"/>

  <!-- Hero purple -->
  <rect x="16" y="56" width="604" height="272" rx="24 24 0 0" fill="${PU}"/>

  <!-- Eye label -->
  <text x="40" y="104"
    font-family="${KR}" font-weight="600" font-size="12"
    fill="rgba(255,255,255,0.55)">나의 선택 유형</text>

  <!-- Type label -->
  <text x="40" y="168"
    font-family="${KR}" font-weight="900" font-size="46"
    fill="${WH}" letter-spacing="-2.5">희귀 소수파</text>

  <!-- Description -->
  <text x="40" y="210"
    font-family="${KR}" font-weight="400" font-size="16"
    fill="rgba(255,255,255,0.72)" letter-spacing="-0.3">남들이 가지 않는 길을 당당하게 걷는 타입</text>

  <!-- Stat box right -->
  <rect x="486" y="84" width="114" height="96" rx="16" fill="rgba(255,255,255,0.18)"/>
  <text x="543" y="140"
    font-family="${LAT}" font-weight="900" font-size="44"
    fill="${WH}" text-anchor="middle" letter-spacing="-2">4</text>
  <text x="543" y="166"
    font-family="${KR}" font-weight="700" font-size="11"
    fill="rgba(255,255,255,0.65)" text-anchor="middle">번 소수파</text>

  <!-- Choices list -->
  <!-- Row 1 -->
  <rect x="32"  y="352" width="572" height="56" rx="12" fill="${LIGHT_GRAY}"/>
  <rect x="48"  y="368" width="28"  height="28" rx="7"  fill="${OR}"/>
  <text x="92"  y="386" font-family="${KR}" font-weight="700" font-size="14" fill="${DK}" letter-spacing="-0.4">평생 치킨 못 먹기</text>
  <text x="574" y="382" font-family="${KR}" font-weight="700" font-size="12" fill="${PU}" text-anchor="end">소수 33%</text>
  <text x="574" y="396" font-family="${KR}" font-weight="700" font-size="10" fill="${GR}" text-anchor="end">실시간</text>

  <!-- Row 2 -->
  <rect x="32"  y="416" width="572" height="56" rx="12" fill="${LIGHT_GRAY}"/>
  <rect x="48"  y="432" width="28"  height="28" rx="7"  fill="${PK}"/>
  <text x="92"  y="450" font-family="${KR}" font-weight="700" font-size="14" fill="${DK}" letter-spacing="-0.4">설레지만 불안한 연애</text>
  <text x="574" y="448" font-family="${KR}" font-weight="700" font-size="12" fill="${PU}" text-anchor="end">소수 41%</text>

  <!-- Row 3 -->
  <rect x="32"  y="480" width="572" height="56" rx="12" fill="${LIGHT_GRAY}"/>
  <rect x="48"  y="496" width="28"  height="28" rx="7"  fill="${BL}"/>
  <text x="92"  y="514" font-family="${KR}" font-weight="700" font-size="14" fill="${DK}" letter-spacing="-0.4">하고 싶은 일 하며 가난하게</text>
  <text x="574" y="512" font-family="${KR}" font-weight="700" font-size="12" fill="#ccc" text-anchor="end">62%</text>

  <!-- Row 4 -->
  <rect x="32"  y="544" width="572" height="56" rx="12" fill="${LIGHT_GRAY}"/>
  <rect x="48"  y="560" width="28"  height="28" rx="7"  fill="${PU}"/>
  <text x="92"  y="578" font-family="${KR}" font-weight="700" font-size="14" fill="${DK}" letter-spacing="-0.4">과거로 돌아가 한 가지 바꾸기</text>
  <text x="574" y="576" font-family="${KR}" font-weight="700" font-size="12" fill="${PU}" text-anchor="end">소수 38%</text>

  <!-- Row 5 -->
  <rect x="32"  y="608" width="572" height="56" rx="12" fill="${LIGHT_GRAY}"/>
  <rect x="48"  y="624" width="28"  height="28" rx="7"  fill="${GR}"/>
  <text x="92"  y="642" font-family="${KR}" font-weight="700" font-size="14" fill="${DK}" letter-spacing="-0.4">1년 무인도 생활하면 100억</text>
  <text x="574" y="640" font-family="${KR}" font-weight="700" font-size="12" fill="${PU}" text-anchor="end">소수 29%</text>

  <!-- Watermark -->
  <text x="318" y="742"
    font-family="${KR}" font-weight="700" font-size="12"
    fill="#ccc" text-anchor="middle" letter-spacing="1">밸런스게임</text>

  <!-- Buttons -->
  <rect x="16"  y="764" width="604" height="64" rx="16" fill="${DK}"/>
  <text x="318" y="804"
    font-family="${KR}" font-weight="800" font-size="18"
    fill="${WH}" text-anchor="middle" letter-spacing="-0.5">결과 공유하기</text>

  <text x="318" y="856"
    font-family="${KR}" font-weight="500" font-size="16"
    fill="#aaa" text-anchor="middle" letter-spacing="-0.3">전체 문제 다시 하기</text>

  <!-- Other category row -->
  <text x="16"  y="902"
    font-family="${KR}" font-weight="700" font-size="12"
    fill="#bbb" letter-spacing="0.3">다른 카테고리 해보기</text>

  <rect x="16"  y="916" width="128" height="44" rx="99" fill="${SOFT_OR}"/>
  <text x="80"  y="944" font-family="${KR}" font-weight="700" font-size="15" fill="${OR}" text-anchor="middle">음식</text>
  <rect x="152" y="916" width="128" height="44" rx="99" fill="${SOFT_PU}"/>
  <text x="216" y="944" font-family="${KR}" font-weight="700" font-size="15" fill="${PU}" text-anchor="middle">인생</text>
  <rect x="288" y="916" width="128" height="44" rx="99" fill="#EDFDF8"/>
  <text x="352" y="944" font-family="${KR}" font-weight="700" font-size="15" fill="${GR}" text-anchor="middle">상상</text>
</svg>`;

/* ══════════════════════════════════════════════════════════════════
   SCREENSHOT 4 — 가로 (1504×741)
   왼쪽 텍스트 / 오른쪽 결과 카드 미리보기
   ══════════════════════════════════════════════════════════════════ */
const svgLand = `<svg width="1504" height="741" viewBox="0 0 1504 741" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="sh2">
      <feDropShadow dx="0" dy="6" stdDeviation="20" flood-color="rgba(0,0,0,0.18)"/>
    </filter>
  </defs>
  <rect width="1504" height="741" fill="${DK}"/>

  <!-- ── Left copy ── -->
  <text x="64" y="220"
    font-family="${KR}" font-weight="900" font-size="80"
    fill="${WH}" letter-spacing="-5">이건 진짜</text>
  <text x="64" y="318"
    font-family="${KR}" font-weight="900" font-size="80"
    fill="${WH}" letter-spacing="-5">고민된다.</text>
  <text x="64" y="380"
    font-family="${KR}" font-weight="400" font-size="24"
    fill="rgba(255,255,255,0.45)" letter-spacing="-0.5">5가지 딜레마 · 선택이 당신을 말한다</text>

  <!-- Pills -->
  <rect x="64"  y="420" width="114" height="40" rx="20" fill="${OR}" fill-opacity="0.20"/>
  <text x="121" y="446" font-family="${KR}" font-weight="700" font-size="18" fill="${OR}" text-anchor="middle">음식</text>
  <rect x="188" y="420" width="114" height="40" rx="20" fill="${PK}" fill-opacity="0.20"/>
  <text x="245" y="446" font-family="${KR}" font-weight="700" font-size="18" fill="${PK}" text-anchor="middle">연애</text>
  <rect x="312" y="420" width="114" height="40" rx="20" fill="${BL}" fill-opacity="0.20"/>
  <text x="369" y="446" font-family="${KR}" font-weight="700" font-size="18" fill="${BL}" text-anchor="middle">직장</text>
  <rect x="436" y="420" width="114" height="40" rx="20" fill="${PU}" fill-opacity="0.20"/>
  <text x="493" y="446" font-family="${KR}" font-weight="700" font-size="18" fill="${PU}" text-anchor="middle">인생</text>
  <rect x="560" y="420" width="114" height="40" rx="20" fill="${GR}" fill-opacity="0.20"/>
  <text x="617" y="446" font-family="${KR}" font-weight="700" font-size="18" fill="${GR}" text-anchor="middle">상상</text>

  <!-- Start btn -->
  <rect x="64" y="492" width="310" height="60" rx="14" fill="${OR}"/>
  <text x="219" y="529"
    font-family="${KR}" font-weight="800" font-size="18"
    fill="${WH}" text-anchor="middle" letter-spacing="-0.5">지금 시작하기</text>

  <!-- ── Right: result card ── -->
  <rect x="832" y="36" width="636" height="668" rx="28" fill="${WH}" filter="url(#sh2)"/>

  <!-- Hero purple -->
  <rect x="832" y="36" width="636" height="256" rx="28 28 0 0" fill="${PU}"/>

  <text x="860" y="96"
    font-family="${KR}" font-weight="600" font-size="13"
    fill="rgba(255,255,255,0.55)">나의 선택 유형</text>
  <text x="860" y="160"
    font-family="${KR}" font-weight="900" font-size="48"
    fill="${WH}" letter-spacing="-2.5">희귀 소수파</text>
  <text x="860" y="200"
    font-family="${KR}" font-weight="400" font-size="16"
    fill="rgba(255,255,255,0.72)" letter-spacing="-0.3">남들이 가지 않는 길을 당당하게 걷는 타입</text>

  <!-- Stat box -->
  <rect x="1362" y="60" width="88" height="84" rx="14" fill="rgba(255,255,255,0.18)"/>
  <text x="1406" y="116"
    font-family="${LAT}" font-weight="900" font-size="38"
    fill="${WH}" text-anchor="middle" letter-spacing="-2">4</text>
  <text x="1406" y="136"
    font-family="${KR}" font-weight="700" font-size="10"
    fill="rgba(255,255,255,0.6)" text-anchor="middle">번 소수파</text>

  <!-- Choices -->
  <rect x="848" y="312" width="604" height="50" rx="10" fill="${LIGHT_GRAY}"/>
  <rect x="864" y="325" width="24"  height="24" rx="6"  fill="${OR}"/>
  <text x="900" y="344" font-family="${KR}" font-weight="700" font-size="13" fill="${DK}" letter-spacing="-0.4">평생 치킨 못 먹기</text>
  <text x="1428" y="340" font-family="${KR}" font-weight="700" font-size="11" fill="${PU}" text-anchor="end">소수 33%</text>

  <rect x="848" y="370" width="604" height="50" rx="10" fill="${LIGHT_GRAY}"/>
  <rect x="864" y="383" width="24"  height="24" rx="6"  fill="${PK}"/>
  <text x="900" y="402" font-family="${KR}" font-weight="700" font-size="13" fill="${DK}" letter-spacing="-0.4">설레지만 불안한 연애</text>
  <text x="1428" y="398" font-family="${KR}" font-weight="700" font-size="11" fill="${PU}" text-anchor="end">소수 41%</text>

  <rect x="848" y="428" width="604" height="50" rx="10" fill="${LIGHT_GRAY}"/>
  <rect x="864" y="441" width="24"  height="24" rx="6"  fill="${BL}"/>
  <text x="900" y="460" font-family="${KR}" font-weight="700" font-size="13" fill="${DK}" letter-spacing="-0.4">하고 싶은 일 하며 가난하게</text>
  <text x="1428" y="456" font-family="${KR}" font-weight="700" font-size="11" fill="#ccc" text-anchor="end">62%</text>

  <rect x="848" y="486" width="604" height="50" rx="10" fill="${LIGHT_GRAY}"/>
  <rect x="864" y="499" width="24"  height="24" rx="6"  fill="${PU}"/>
  <text x="900" y="518" font-family="${KR}" font-weight="700" font-size="13" fill="${DK}" letter-spacing="-0.4">과거로 돌아가 한 가지 바꾸기</text>
  <text x="1428" y="514" font-family="${KR}" font-weight="700" font-size="11" fill="${PU}" text-anchor="end">소수 38%</text>

  <rect x="848" y="544" width="604" height="50" rx="10" fill="${LIGHT_GRAY}"/>
  <rect x="864" y="557" width="24"  height="24" rx="6"  fill="${GR}"/>
  <text x="900" y="576" font-family="${KR}" font-weight="700" font-size="13" fill="${DK}" letter-spacing="-0.4">1년 무인도 생활하면 100억</text>
  <text x="1428" y="572" font-family="${KR}" font-weight="700" font-size="11" fill="${PU}" text-anchor="end">소수 29%</text>

  <!-- Watermark -->
  <text x="1150" y="638"
    font-family="${KR}" font-weight="700" font-size="12"
    fill="#ccc" text-anchor="middle" letter-spacing="1">밸런스게임</text>

  <!-- Share btn -->
  <rect x="848" y="654" width="604" height="36" rx="12" fill="${DK}"/>
  <text x="1150" y="678"
    font-family="${KR}" font-weight="800" font-size="15"
    fill="${WH}" text-anchor="middle" letter-spacing="-0.5">결과 공유하기</text>
</svg>`;

/* ══════════════════════════════════════════════════════════════════
   MAIN
   ══════════════════════════════════════════════════════════════════ */
async function main() {
  console.log('Generating AIT store assets...\n');
  await render(svgLogo,     'logo_600x600.png');
  await render(svgLogoDark, 'logo_dark_600x600.png');
  await render(svgThumb,    'thumbnail_1932x828.png');
  await render(svgS1,       'screen1_636x1048.png');
  await render(svgS2,       'screen2_636x1048.png');
  await render(svgS3,       'screen3_636x1048.png');
  await render(svgLand,     'screen4_landscape_1504x741.png');
  console.log('\nAll done →', OUT);
}

main().catch(console.error);
