CREATE TABLE comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id TEXT NOT NULL UNIQUE,
  thread TEXT NOT NULL,
  nickname TEXT NOT NULL DEFAULT '匿名',
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','hidden')),
  created_at INTEGER NOT NULL,
  moderated_at INTEGER,
  sender_hash TEXT
);
CREATE INDEX idx_comments_thread_status_id ON comments(thread,status,id);
CREATE INDEX idx_comments_status_id ON comments(status,id);
CREATE INDEX idx_comments_sender_created ON comments(sender_hash,created_at);
