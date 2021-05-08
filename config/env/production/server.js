module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL', 'https://myspace4you.herokuapp.com/'),
  cron: {
    enabled: env.bool('CRON_ENABLED', true),
  },
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', '6bae9cfe9851b902278547d56ed69d86'),
    },
    forgotPassword:{
      from:"support@myspace4you.com",
      replyTo:"support@myspace4you.com"
    }
  },
});
