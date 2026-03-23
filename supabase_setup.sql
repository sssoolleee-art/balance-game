-- 1. 투표 테이블 생성
CREATE TABLE IF NOT EXISTS votes (
  question_id  INTEGER PRIMARY KEY,
  a_count      BIGINT  NOT NULL DEFAULT 0,
  b_count      BIGINT  NOT NULL DEFAULT 0,
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RLS 활성화 (직접 update 차단)
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- 3. 누구나 읽기 허용
CREATE POLICY "allow_read" ON votes
  FOR SELECT USING (true);

-- 4. 원자적 투표 함수 (직접 UPDATE 대신 이 함수만 노출)
CREATE OR REPLACE FUNCTION cast_vote(q_id INTEGER, picked TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO votes (question_id, a_count, b_count)
    VALUES (q_id, 0, 0)
    ON CONFLICT (question_id) DO NOTHING;

  IF picked = 'A' THEN
    UPDATE votes SET a_count = a_count + 1, updated_at = NOW()
      WHERE question_id = q_id;
  ELSE
    UPDATE votes SET b_count = b_count + 1, updated_at = NOW()
      WHERE question_id = q_id;
  END IF;
END;
$$;

-- 5. anon 유저가 함수 호출 가능하도록
GRANT EXECUTE ON FUNCTION cast_vote TO anon;
