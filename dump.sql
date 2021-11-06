CREATE TABLE server (
	uuid BINARY(16) NOT NULL,

	created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

	PRIMARY KEY (uuid)
)

CREATE TABLE player (
	uuid BINARY(16) NOT NULL,
  server BINARY(16) NOT NULL,
	
	created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

	PRIMARY KEY (uuid, server),
	FOREIGN KEY (server) REFERENCES server(uuid) ON DELETE CASCADE
)

CREATE TABLE entry (
	uuid BINARY(16) NOT NULL,

  server BINARY(16) NOT NULL,
  player BINARY(16) NOT NULL,

	sips TINYINT DEFAULT 0,
	shots TINYINT DEFAULT 0,

	created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

	PRIMARY KEY (uuid),
	FOREIGN KEY (player, server) REFERENCES player(uuid, server) ON DELETE CASCADE
)

ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;