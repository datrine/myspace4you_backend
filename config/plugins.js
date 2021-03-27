module.exports = ({ env }) => ({
    upload: {
      provider: 'aws-s3',
      providerOptions: {
        accessKeyId: env('AKIAICZ65NUI337XGHLQ'),
        secretAccessKey: env('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'),
        region: 'global',
        params: {
          Bucket: 'myspace4youbucket',
        },
      },
    },
  });