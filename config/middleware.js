module.exports = {
    settings: {
        cors: {
            origin: "*"
        },
        sentry: {
          enabled: true,
        },
        parser: {
            enabled: true,
            multipart: true,
            formidable: {
                maxFileSize: 200 * 1024 * 1024 // Defaults to 200mb
            }
        }
    },
    load: {
        "before": [ 'sentry',"cors"]
    }
}