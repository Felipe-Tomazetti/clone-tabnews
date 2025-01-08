import database from "infra/database.js";

async function status(request, response) {
  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections;",
  );
  const databaseMaxConnectionsValue =
    databaseMaxConnectionsResult.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsResult.rows[0].count;

  const versionAndSettings = await database.query(`
    SELECT
      version() AS version,
      setting AS max_connections
    FROM pg_settings
    WHERE name = 'max_connections';
  `);

  const activeSessions = await database.query(`
    SELECT COUNT(*)
    FROM pg_stat_activity
    WHERE state = 'active';
  `);

  const postgresVersion = versionAndSettings.rows[0].version.split("on")[0];
  const maxConnections = versionAndSettings.rows[0].max_connections;
  const activeSessionsNumber = activeSessions.rows[0].count;

  const updatedAt = new Date().toISOString();

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(databaseMaxConnectionsValue),
        opened_connections: databaseOpenedConnectionsValue,
      },
    },
  });
}

export default status;
