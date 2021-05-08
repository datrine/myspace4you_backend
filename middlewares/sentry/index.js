const Sentry = require('@sentry/node');
Sentry.init({
    dsn: "https://bbcf6e7436f141efa125d6be0ae4a191@o623856.ingest.sentry.io/5753195",
    environment: strapi.config.environment,
});

module.exports = strapi => {
    return {
        initialize() {
            strapi.app.use(async (ctx, next) => {
                try {
                    await next();
                } catch (error) {
                    Sentry.captureException(error);
                    throw error;
                }
            });
        },
    };
};