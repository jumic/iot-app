import { App } from '@aws-cdk/core';
import { PipelineStack } from './pipeline-stack';
import { StatefulStack } from './stateful-stack';

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new StatefulStack(app, 'Stateful-stack-dev', { env: devEnv });

new PipelineStack(app, 'IotAppPipelineStack', {
  env: {
    account: '624132653920',
    region: 'eu-central-1',
  },
});

app.synth();
