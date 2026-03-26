import React, { useState, useCallback, useRef, useEffect } from 'react';
import { questions, getSeededPercent, CATEGORIES, type Category } from './data/questions';
import { recordVote, fetchVotes, toPercent, type VoteRow } from './supabase';

type Choice = 'A' | 'B' | null;
type Phase  = 'intro' | 'playing' | 'result';

const ROUND_SIZE = 5;

const CAT: Record<Category, { vivid: string; pale: string; soft: string; glyph: string }> = {
  '음식': { vivid: '#FF5C35', pale: '#FFF3EF', soft: '#FFE8E0', glyph: '🍜' },
  '연애': { vivid: '#E91E8C', pale: '#FFF0F8', soft: '#FFD6ED', glyph: '💘' },
  '직장': { vivid: '#1A73E8', pale: '#EFF4FF', soft: '#D6E4FF', glyph: '💼' },
  '인생': { vivid: '#7B2FBE', pale: '#F5F0FF', soft: '#E2D4F8', glyph: '🌙' },
  '상상': { vivid: '#00A878', pale: '#EDFDF8', soft: '#C8F2E8', glyph: '🌀' },
};

const CAT_WEIGHT: Record<Category, number> = {
  '음식': 0, '상상': 1, '연애': 2, '직장': 3, '인생': 4,
};

interface Result { emoji: string; label: string; desc: string; color: string }

// 결과 유형 7가지 — 소수파 횟수 + 카테고리 패턴 조합
function getResult(choices: Choice[], round: typeof questions): Result {
  const minItems = round.filter((q, i) => {
    const p = getSeededPercent(q.id);
    return (choices[i] === 'A' && p < 50) || (choices[i] === 'B' && p >= 50);
  });
  const minCount = minItems.length;
  const minCats  = new Set(minItems.map(q => q.category));

  if (minCount === 5)
    return { emoji: '🌌', label: '완전체 소수파',   desc: '5개 전부 소수 선택. 당신만의 세계가 확실해요.',        color: '#4C1D95' };
  if (minCount === 4)
    return { emoji: '🦄', label: '희귀 소수파',     desc: '남들이 가지 않는 길을 당당하게 걷는 타입이에요.',      color: '#7B2FBE' };
  if (minCount === 3 && (minCats.has('연애') || minCats.has('인생')))
    return { emoji: '💭', label: '감성 소수파',     desc: '사랑과 인생에서 특히 자기만의 길을 걷는 타입이에요.',  color: '#E91E8C' };
  if (minCount === 3)
    return { emoji: '⚡', label: '반골 기질형',     desc: '절반은 대세, 절반은 반골 — 나만의 기준이 있어요.',    color: '#D97706' };
  if (minCount === 2)
    return { emoji: '🌊', label: '현실 감각형',     desc: '대체로 다수와 함께지만 가끔은 나만의 선택도 해요.',   color: '#1A73E8' };
  if (minCount === 1)
    return { emoji: '🤝', label: '공감형',          desc: '사람들과 잘 통하고 보편적인 감각을 가진 타입이에요.', color: '#00A878' };
  return   { emoji: '👑', label: '대세 공감형',     desc: '5개 전부 다수 선택. 가장 보편적인 감각의 타입이에요.', color: '#374151' };
}

const recentIds = new Set<number>();

function pickRound(filterCat: Category | null) {
  const pool = filterCat ? questions.filter(q => q.category === filterCat) : questions;
  const fresh = pool.filter(q => !recentIds.has(q.id));
  const source = fresh.length >= ROUND_SIZE ? fresh : pool;
  const picked = [...source].sort(() => Math.random() - 0.5).slice(0, ROUND_SIZE);
  picked.sort((a, b) => CAT_WEIGHT[a.category] - CAT_WEIGHT[b.category]);
  recentIds.clear();
  picked.forEach(q => recentIds.add(q.id));
  return picked;
}

/** 실제 투표 수 or seeded fallback */
function resolvePercent(qId: number, voteMap: Map<number, VoteRow>): number {
  const row = voteMap.get(qId);
  if (row) {
    const real = toPercent(row);
    if (real >= 0) return real;
  }
  return getSeededPercent(qId); // 데이터 부족 시 seeded
}

export default function App() {
  const [phase, setPhase]           = useState<Phase>('intro');
  const [filterCat, setFilterCat]   = useState<Category | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [round, setRound]           = useState<typeof questions>([]);
  const [step, setStep]             = useState(0);
  const [choice, setChoice]         = useState<Choice>(null);
  const [choices, setChoices]       = useState<Choice[]>([]);
  const [voteMap, setVoteMap]       = useState<Map<number, VoteRow>>(new Map());
  const animKey = useRef(0);

  // 라운드 시작 시 실제 투표 수 fetch
  useEffect(() => {
    if (round.length === 0) return;
    fetchVotes(round.map(q => q.id)).then(rows => {
      const m = new Map<number, VoteRow>();
      rows.forEach(r => m.set(r.question_id, r));
      setVoteMap(m);
    });
  }, [round]);

  // 선택 시 투표 기록
  const currentQuestion = round[step];
  useEffect(() => {
    if (!choice || !currentQuestion) return;
    recordVote(currentQuestion.id, choice);
  }, [choice, currentQuestion?.id]);

  function startGame(cat?: Category | null) {
    const c = cat !== undefined ? cat : filterCat;
    if (cat !== undefined) setFilterCat(cat);
    setRound(pickRound(c));
    setStep(0); setChoice(null); setChoices([]); setVoteMap(new Map()); setPhase('playing');
  }

  const pick = useCallback((c: 'A' | 'B') => {
    animKey.current += 1;
    setChoice(c);
  }, []);

  function goNext() {
    const next = [...choices, choice];
    if (step + 1 >= ROUND_SIZE) { setChoices(next); setPhase('result'); }
    else { setStep(s => s + 1); setChoice(null); setChoices(next); }
  }

  function goBack() {
    if (step === 0) { setPhase('intro'); return; }
    const prev = choices.slice(0, -1);
    setChoices(prev); setStep(s => s - 1); setChoice(choices[step - 1]);
  }

  function shareResult() {
    const result = getResult(choices, round);
    const withPcts = round.map((q, i) => {
      const p   = resolvePercent(q.id, voteMap);
      const myP = choices[i] === 'A' ? p : 100 - p;
      return { q, c: choices[i], myP };
    }).sort((a, b) => a.myP - b.myP);

    const rarest = withPcts[0];
    const rarestText = rarest.c === 'A' ? rarest.q.a.split('\n')[0] : rarest.q.b.split('\n')[0];
    const hook = rarest.myP < 50
      ? `"${rarestText}"을 골랐는데 이걸 고른 사람이 ${rarest.myP}%밖에 없대. 넌?`
      : '밸런스게임 해봤는데 생각보다 고민 많이 됐음. 넌 어떻게 할 것 같아?';

    const lines = round.map((q, i) => {
      const p   = resolvePercent(q.id, voteMap);
      const myP = choices[i] === 'A' ? p : 100 - p;
      const txt = choices[i] === 'A' ? q.a.split('\n')[0] : q.b.split('\n')[0];
      return `${myP < 50 ? '🦄' : '✅'} ${txt} (${myP}%)`;
    });
    const text = `${hook}\n\n나는 ${result.emoji} ${result.label}\n${lines.join('\n')}\n\n👇 밸런스게임`;
    navigator.clipboard.writeText(text).then(() => setShowCopied(true));
  }

  function shareQuestion(q: typeof questions[0], myChoice: Choice, myPct: number) {
    const picked = myChoice === 'A' ? q.a.split('\n')[0] : q.b.split('\n')[0];
    const other  = myChoice === 'A' ? q.b.split('\n')[0] : q.a.split('\n')[0];
    const hook   = myPct < 50
      ? `나 "${picked}" 골랐는데 이거 고른 사람이 ${myPct}%밖에 없대 😂 넌?`
      : `"${picked}" vs "${other}" — 넌 어느 쪽?`;
    const text = `${hook}\n\n👇 밸런스게임`;
    navigator.clipboard.writeText(text).then(() => setShowCopied(true));
  }

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div style={s.intro}>
        <div style={s.emojiCloud}>
          <span style={{ ...s.fe, fontSize: 72,  top: '8%',    left: '12%',  transform: 'rotate(-18deg)' }}>🍜</span>
          <span style={{ ...s.fe, fontSize: 56,  top: '6%',    right: '16%', transform: 'rotate(12deg)'  }}>💘</span>
          <span style={{ ...s.fe, fontSize: 100, top: '28%',   left: '50%',  transform: 'translateX(-50%)' }}>🤔</span>
          <span style={{ ...s.fe, fontSize: 60,  bottom: '26%',left: '8%',   transform: 'rotate(-8deg)'  }}>💼</span>
          <span style={{ ...s.fe, fontSize: 52,  bottom: '30%',right: '10%', transform: 'rotate(14deg)'  }}>🌙</span>
          <span style={{ ...s.fe, fontSize: 44,  top: '18%',   right: '6%',  transform: 'rotate(-5deg)', opacity: 0.45 }}>🌀</span>
          <div style={s.cloudFade} />
        </div>
        <div style={s.introBody}>
          <h1 style={s.introTitle}>이건 진짜<br />고민된다.</h1>
          <p style={s.introSub}>5가지 딜레마 · 나라면 어떻게 할까?</p>
          <div style={{ marginTop: 8 }}>
            <button style={s.filterToggle} onClick={() => setFilterOpen(o => !o)}>
              <span style={s.filterLabel}>{filterCat ? `${filterCat} 문제만` : '전체 카테고리'}</span>
              <span style={{ fontSize: 12, color: '#aaa' }}>{filterOpen ? '▲' : '▾'}</span>
            </button>
            {filterOpen && (
              <div style={s.chips}>
                {([null, ...CATEGORIES] as (Category | null)[]).map(cat => (
                  <button key={cat ?? 'all'}
                    style={{ ...s.chip, ...(filterCat === cat ? s.chipOn : {}) }}
                    onClick={() => { setFilterCat(cat); setFilterOpen(false); }}>
                    {cat ? `${CAT[cat].glyph} ${cat}` : '전체'}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button style={s.startBtn} onClick={() => startGame()}>지금 시작하기</button>
        </div>
      </div>
    );
  }

  // ── RESULT ─────────────────────────────────────────────────────────────────
  if (phase === 'result') {
    const result   = getResult(choices, round);
    const minCount = round.filter((q, i) => {
      const p = resolvePercent(q.id, voteMap);
      return (choices[i] === 'A' && p < 50) || (choices[i] === 'B' && p >= 50);
    }).length;
    const usedCats  = new Set(round.map(q => q.category));
    const otherCats = CATEGORIES.filter(c => !usedCats.has(c));

    return (
      <div style={s.result}>
        <div style={s.resultCard}>
          <div style={{ ...s.resultHero, background: result.color }}>
            <div style={s.resultHeroInner}>
              <div style={s.resultLeft}>
                <p style={s.resultEye}>나의 선택 유형</p>
                <h1 style={s.resultLabel}>{result.emoji} {result.label}</h1>
                <p style={s.resultDesc}>{result.desc}</p>
              </div>
              <div style={s.resultRight}>
                <span style={s.resultBigN}>{minCount}</span>
                <span style={s.resultBigNLabel}>{'번\n소수파'}</span>
              </div>
            </div>
          </div>
          <div style={s.resultChoices}>
            {round.map((q, i) => {
              const p    = resolvePercent(q.id, voteMap);
              const myP  = choices[i] === 'A' ? p : 100 - p;
              const text = choices[i] === 'A' ? q.a.split('\n')[0] : q.b.split('\n')[0];
              const isM  = myP < 50;
              const isReal = voteMap.has(q.id) && toPercent(voteMap.get(q.id)!) >= 0;
              return (
                <div key={q.id} style={s.rRow}>
                  <span style={{ ...s.rDot, background: CAT[q.category].vivid }}>{CAT[q.category].glyph}</span>
                  <span style={s.rText}>{text}</span>
                  <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
                    <span style={{ ...s.rPct, color: isM ? '#7B2FBE' : '#ccc' }}>
                      {isM ? '🦄 ' : ''}{myP}%
                    </span>
                    {isReal && <span style={s.rRealBadge}>실시간</span>}
                  </div>
                </div>
              );
            })}
          </div>
          <p style={s.resultWatermark}>밸런스게임</p>
        </div>

        <div style={s.resultFoot}>
          <button style={s.shareBtn} onClick={shareResult}>결과 공유하기</button>
          <button style={s.ghostBtn} onClick={() => startGame(null)}>전체 문제 다시 하기</button>
          {otherCats.length > 0 && (
            <div style={s.catSuggest}>
              <p style={s.catSuggestLabel}>다른 카테고리 해보기</p>
              <div style={s.catSuggestRow}>
                {otherCats.map(cat => (
                  <button key={cat}
                    style={{ ...s.catSuggestBtn, background: CAT[cat].soft, color: CAT[cat].vivid }}
                    onClick={() => startGame(cat)}>
                    {CAT[cat].glyph} {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── PLAYING ────────────────────────────────────────────────────────────────
  const q   = round[step];
  const cat = CAT[q.category];
  const aPct  = resolvePercent(q.id, voteMap);
  const bPct  = 100 - aPct;
  const aFlex = choice ? aPct : 1;
  const bFlex = choice ? bPct : 1;
  const myPct = choice === 'A' ? aPct : bPct;
  const isMin = choice !== null && myPct < 50;
  const isRealData = voteMap.has(q.id) && toPercent(voteMap.get(q.id)!) >= 0;
  const ck    = animKey.current;

  const aBg = choice === 'A' ? cat.vivid : choice === 'B' ? cat.pale : cat.soft;
  const bBg = choice === 'B' ? cat.vivid : choice === 'A' ? cat.pale : cat.soft;

  return (
    <div style={s.play}>
      <div style={s.nav}>
        <button style={s.backBtn} onClick={goBack}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="#333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div style={s.track}>
          <div style={{ ...s.trackFill, width: `${(step / ROUND_SIZE) * 100}%`, background: cat.vivid }} />
        </div>
        <span style={{ ...s.catBadge, background: cat.pale, color: cat.vivid }}>
          {cat.glyph} {q.category}
        </span>
      </div>

      <div style={s.arena}>
        <button
          style={{ ...s.panel, flex: aFlex, background: aBg, opacity: choice === 'B' ? 0.38 : 1, borderRadius: '20px 20px 6px 6px', justifyContent: choice === 'A' ? 'flex-start' : 'center' }}
          onClick={() => pick('A')}
        >
          <span style={s.panelGlyph}>{cat.glyph}</span>
          <p style={{ ...s.panelText, color: choice === 'A' ? '#fff' : '#111' }}>{q.a}</p>
          {choice === 'A' && (
            <p key={ck} className="pct-in" style={{ ...s.pctNum, color: 'rgba(255,255,255,0.88)' }}>
              {aPct}<span style={s.pctSuffix}>%</span>
            </p>
          )}
        </button>

        <div style={s.divider}>
          <span style={{ ...s.vsText, color: cat.vivid }}>VS</span>
        </div>

        <button
          style={{ ...s.panel, flex: bFlex, background: bBg, opacity: choice === 'A' ? 0.38 : 1, borderRadius: '6px 6px 20px 20px', justifyContent: choice === 'B' ? 'flex-start' : 'center' }}
          onClick={() => pick('B')}
        >
          <span style={s.panelGlyph}>{cat.glyph}</span>
          <p style={{ ...s.panelText, color: choice === 'B' ? '#fff' : '#111' }}>{q.b}</p>
          {choice === 'B' && (
            <p key={ck + 1000} className="pct-in" style={{ ...s.pctNum, color: 'rgba(255,255,255,0.88)' }}>
              {bPct}<span style={s.pctSuffix}>%</span>
            </p>
          )}
        </button>
      </div>

      <div style={s.foot}>
        {choice ? (
          <>
            {isMin ? (
              <div key={ck + 2000} className="minority-pop" style={s.minorityBox}>
                <div style={s.minorityRow}>
                  <span style={s.minorityEmoji}>🦄</span>
                  <div>
                    <p style={s.minorityNum}>
                      {myPct}%만 이 선택
                      {isRealData && <span style={s.liveTag}>· 실시간</span>}
                    </p>
                    <p style={s.minorityDesc}>소수파예요 — 꽤 특이한 취향이네요</p>
                  </div>
                </div>
              </div>
            ) : (
              <p key={ck + 2000} className="stat-in" style={s.stat}>
                {myPct}%가 같은 선택
                {isRealData && <span style={s.liveTag}> · 실시간</span>}
              </p>
            )}
            <div style={s.footBtns}>
              <button style={{ ...s.nextBtn, background: cat.vivid }} onClick={goNext}>
                {step + 1 >= ROUND_SIZE ? '결과 보기' : '다음 문제'}
              </button>
              <button style={s.qShareBtn} onClick={() => shareQuestion(q, choice, myPct)}>
                이 질문 공유
              </button>
            </div>
          </>
        ) : (
          <p style={s.hint}>탭해서 선택 · 다시 탭하면 바꿀 수 있어요</p>
        )}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  intro:       { minHeight: '100vh', background: '#FAFAF7', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' },
  emojiCloud:  { position: 'relative', height: '56vh', flexShrink: 0, overflow: 'hidden' },
  fe:          { position: 'absolute', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' },
  cloudFade:   { position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%', background: 'linear-gradient(to bottom, transparent, #FAFAF7)' },
  introBody:   { padding: '0 24px 48px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, justifyContent: 'flex-end' },
  introTitle:  { fontSize: '60px', fontWeight: 900, color: '#111', letterSpacing: '-3.5px', lineHeight: 1.0, marginBottom: '8px' },
  introSub:    { fontSize: '16px', color: '#999', letterSpacing: '-0.3px', marginBottom: '16px' },
  filterToggle:{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 0 8px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' },
  filterLabel: { fontSize: '14px', fontWeight: 600, color: '#aaa', letterSpacing: '-0.2px' },
  chips:       { display: 'flex', flexWrap: 'wrap' as const, gap: '8px', marginBottom: '12px' },
  chip:        { padding: '8px 16px', borderRadius: '99px', fontSize: '14px', fontWeight: 600, color: '#555', background: '#EFEFEB', border: 'none', letterSpacing: '-0.3px', cursor: 'pointer', fontFamily: 'inherit' },
  chipOn:      { background: '#111', color: '#fff' },
  startBtn:    { width: '100%', padding: '18px', fontSize: '17px', fontWeight: 800, color: '#fff', background: '#111', border: 'none', borderRadius: '16px', letterSpacing: '-0.5px', cursor: 'pointer', fontFamily: 'inherit', marginTop: '4px' },

  play:        { height: '100vh', display: 'flex', flexDirection: 'column', background: '#FAFAF7', overflow: 'hidden' },
  nav:         { padding: '52px 20px 10px', display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 },
  backBtn:     { display: 'flex', alignItems: 'center', flexShrink: 0, padding: '4px', background: 'none', border: 'none', cursor: 'pointer' },
  track:       { flex: 1, height: '3px', background: '#E8E8E2', borderRadius: '2px', overflow: 'hidden' },
  trackFill:   { height: '100%', borderRadius: '2px', transition: 'width 0.4s ease' },
  catBadge:    { fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '99px', letterSpacing: '-0.2px', flexShrink: 0 },

  arena:       { flex: 1, display: 'flex', flexDirection: 'column', padding: '6px 12px 0', minHeight: 0 },
  panel:       { border: 'none', display: 'flex', flexDirection: 'column', padding: '22px 24px', textAlign: 'left' as const, minHeight: 0, cursor: 'pointer', fontFamily: 'inherit', overflow: 'hidden', position: 'relative', transition: ['flex 0.6s cubic-bezier(0.34,1.1,0.64,1)', 'background 0.28s ease', 'opacity 0.25s ease'].join(', ') },
  panelGlyph:  { position: 'absolute', right: -6, bottom: -10, fontSize: 96, opacity: 0.13, pointerEvents: 'none', userSelect: 'none', transform: 'rotate(15deg)' },
  panelText:   { fontSize: '24px', fontWeight: 900, letterSpacing: '-1px', lineHeight: 1.3, whiteSpace: 'pre-line' as const, transition: 'color 0.25s ease', position: 'relative' },
  pctNum:      { fontSize: '84px', fontWeight: 900, letterSpacing: '-6px', lineHeight: 1, marginTop: 'auto', alignSelf: 'flex-end' as const, position: 'relative' },
  pctSuffix:   { fontSize: '48px', letterSpacing: '-3px' },
  divider:     { height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: '#FAFAF7' },
  vsText:      { fontSize: '11px', fontWeight: 800, letterSpacing: '3px', opacity: 0.6 },

  foot:        { padding: '10px 16px 36px', flexShrink: 0, minHeight: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '8px', background: '#FAFAF7' },
  minorityBox: { background: '#F3EEFF', borderRadius: '14px', padding: '14px 16px' },
  minorityRow: { display: 'flex', alignItems: 'center', gap: '12px' },
  minorityEmoji:{ fontSize: '32px', lineHeight: 1, flexShrink: 0 },
  minorityNum: { fontSize: '17px', fontWeight: 900, color: '#7B2FBE', letterSpacing: '-0.5px' },
  minorityDesc:{ fontSize: '13px', fontWeight: 500, color: '#9E7FD4', marginTop: '2px', letterSpacing: '-0.2px' },
  liveTag:     { fontSize: '11px', fontWeight: 600, color: '#00A878', marginLeft: '4px' },
  stat:        { fontSize: '14px', fontWeight: 600, textAlign: 'center' as const, letterSpacing: '-0.3px', color: '#aaa' },

  footBtns:    { display: 'flex', gap: '8px', alignItems: 'center' },
  nextBtn:     { flex: 1, padding: '17px', fontSize: '17px', fontWeight: 800, color: '#fff', border: 'none', borderRadius: '16px', letterSpacing: '-0.5px', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.25s ease' },
  qShareBtn:   { flexShrink: 0, padding: '17px 16px', fontSize: '14px', fontWeight: 700, color: '#888', background: '#EFEFEB', border: 'none', borderRadius: '16px', cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '-0.3px', whiteSpace: 'nowrap' as const },
  hint:        { fontSize: '14px', color: '#bbb', textAlign: 'center' as const, letterSpacing: '-0.2px' },

  result:      { minHeight: '100vh', background: '#FAFAF7', display: 'flex', flexDirection: 'column' },
  resultCard:  { margin: '52px 16px 0', background: '#fff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.10)' },
  resultHero:  { padding: '28px 24px 24px' },
  resultHeroInner:{ display: 'flex', alignItems: 'flex-start', gap: '12px' },
  resultLeft:  { flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' },
  resultRight: { display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255,255,255,0.2)', borderRadius: '16px', padding: '12px 16px', flexShrink: 0, textAlign: 'center' as const },
  resultBigN:  { fontSize: '40px', fontWeight: 900, color: '#fff', letterSpacing: '-2px', lineHeight: 1 },
  resultBigNLabel: { fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.65)', whiteSpace: 'pre-line' as const, textAlign: 'center' as const },
  resultEye:   { fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.55)' },
  resultLabel: { fontSize: '36px', fontWeight: 900, color: '#fff', letterSpacing: '-2px', lineHeight: 1.05, margin: 0 },
  resultDesc:  { fontSize: '15px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.5, letterSpacing: '-0.3px' },
  resultChoices:{ padding: '16px 20px 4px', display: 'flex', flexDirection: 'column', gap: '6px' },
  rRow:        { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: '#F7F7F5', borderRadius: '12px' },
  rDot:        { width: '30px', height: '30px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 },
  rText:       { flex: 1, fontSize: '14px', fontWeight: 700, color: '#111', letterSpacing: '-0.4px' },
  rPct:        { fontSize: '12px', fontWeight: 700, display: 'block' },
  rRealBadge:  { fontSize: '10px', fontWeight: 700, color: '#00A878', display: 'block', marginTop: '1px' },
  resultWatermark: { textAlign: 'center' as const, fontSize: '12px', fontWeight: 700, color: '#ccc', letterSpacing: '1px', padding: '12px 0 16px' },
  resultFoot:  { padding: '16px 16px 44px', display: 'flex', flexDirection: 'column', gap: '8px' },
  shareBtn:    { width: '100%', padding: '17px', fontSize: '17px', fontWeight: 800, color: '#fff', background: '#111', border: 'none', borderRadius: '16px', letterSpacing: '-0.5px', cursor: 'pointer', fontFamily: 'inherit' },
  ghostBtn:    { width: '100%', padding: '12px', fontSize: '15px', fontWeight: 500, color: '#aaa', letterSpacing: '-0.3px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' },
  catSuggest:  { borderTop: '1px solid #EFEFEB', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' },
  catSuggestLabel: { fontSize: '12px', fontWeight: 700, color: '#bbb', letterSpacing: '0.5px' },
  catSuggestRow:   { display: 'flex', flexWrap: 'wrap' as const, gap: '8px' },
  catSuggestBtn:   { padding: '8px 14px', borderRadius: '99px', fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '-0.3px' },
};
