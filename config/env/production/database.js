console.log("Production...")
module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'mysql',
        host: env('DATABASE_HOST', 'wgh9.whogohost.com'),
        port: env.int('DATABASE_PORT', 3306),
        database: env('DATABASE_NAME', 'medikedu_roomsdb'),
        username: env('DATABASE_USERNAME', 'medikedu_datrine'),
        password: env('DATABASE_PASSWORD', 'TeMi4ToPe'),
        ssl: env.bool('DATABASE_SSL', false),
      },
      options: {}
    },
  },
});
