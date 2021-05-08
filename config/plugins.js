module.exports = ({ env }) => ({
  upload: {
    provider: 'aws-s3',
    providerOptions: {
      accessKeyId: env('AKIASWN6B2XU6FMJX4JE'),
      secretAccessKey: env('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'),
      //region: 'global',
      params: {
        Bucket: 'myspace4youbucket',
      },
      s3BucketEndpoint: false,
    },
  },
  email: {
    provider: 'amazon-ses',
    providerOptions: {
      key: 'AKIASWN6B2XU6FMJX4JE',
      secret: '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',
      //amazon: 'https://email.us-east-1.amazonaws.com',
    },
    settings: {
      defaultFrom: 'support@myspace4you.com',
      defaultReplyTo: 'support@myspace4you.com',
    },
  },
});