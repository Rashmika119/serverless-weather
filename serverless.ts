import type { AWS } from '@serverless/typescript';

import weather from '@functions/weather';

const serverlessConfiguration: AWS = {
  service: 'weather-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild','serverless-offline','serverless-domain-manager'],
  provider: {
    name: 'aws',
    profile:'sls',
    runtime: 'nodejs20.x',
        stage: 'dev',
        stackName: '${self:service}-stack-${self:provider.stage}',
        apiName: '${self:service}-${self:provider.stage}',
        region: 'us-west-2', 
        endpointType: 'regional',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      OPENWEATHER_API_KEY:'3819c47a47ebca1fbef49985306f8419'
    },
  },
  // import the function via paths
  functions: { weather },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node20',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    customDomain:{
      domainName:'weather.nethsarani.online',
      certificateName:'*.nethsarani.online',
      basePath: '', 
      stage:'dev',
      createRoute53Record:true,
      endpointType:'regional',
    }
  },
};

module.exports = serverlessConfiguration;
