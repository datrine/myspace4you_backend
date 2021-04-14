module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'mysql',
        host: env('DATABASE_HOST', 'eel.whogohost.com'),
        port: env.int('DAListingListingTABASE_PORT', 3306),
        database: env('DATABASE_NAME', 'stylezns_roomsdb'),
        username: env('DATABASE_USERNAME', 'stylezns_datrine'),
        password: env('DATABASE_PASSWORD', 'TeMi4ToPe'),
        ssl: env.bool('DATABASE_SSL', false),
      },
      options: {}
    },
  },
});
