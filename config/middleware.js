module.exports = {
    settings: {
        cors: {
            origin: "*"
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
        "before": ["cors"]
    }
}