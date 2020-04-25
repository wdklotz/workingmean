DROP TABLE IF EXISTS tickets;

CREATE TABLE tickets(
  id        INTEGER PRIMARY KEY,
  author    VARCHAR(15),
  subject   VARCHAR(50),
  issue     VARCHAR(255),
  chatUrl   VARCHAR(255),
  createdAt VARCHAR(100),
  archive   BOOLEAN,
  status    BOOLEAN
);
