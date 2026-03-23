import { createClient } from '@supabase/supabase-js';

const URL  = import.meta.env.VITE_SUPABASE_URL  as string;
const KEY  = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = (URL && KEY && URL.startsWith('https://')) ? createClient(URL, KEY) : null;

export type VoteRow = { question_id: number; a_count: number; b_count: number };

/** 선택 기록 — 실패해도 게임에 영향 없음 */
export async function recordVote(questionId: number, choice: 'A' | 'B') {
  if (!supabase) return;
  await supabase.rpc('cast_vote', { q_id: questionId, picked: choice });
}

/** 여러 질문의 실제 투표 수 가져오기 */
export async function fetchVotes(questionIds: number[]): Promise<VoteRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('votes')
    .select('question_id, a_count, b_count')
    .in('question_id', questionIds);
  if (error || !data) return [];
  return data as VoteRow[];
}

/** 투표 수 → 퍼센트 (A 선택 기준) */
export function toPercent(row: VoteRow): number {
  const total = row.a_count + row.b_count;
  if (total < 10) return -1; // 데이터 부족, fallback 사용
  return Math.round((row.a_count / total) * 100);
}
