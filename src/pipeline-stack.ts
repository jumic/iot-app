import { Construct, Stack, StackProps } from '@aws-cdk/core';
import * as pipelines from '@aws-cdk/pipelines';
import { Application } from './application';

// new MyStack(app, 'my-stack-prod', { env: prodEnv });
export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      synth: new pipelines.ShellStep('Synth', {
        input: pipelines.CodePipelineSource.connection('jumic/iot-app', 'main', {
          connectionArn: 'arn:aws:codestar-connections:eu-central-1:624132653920:connection/1edb6c36-946f-452d-a051-849b7ffbca7b',
        }),
        commands: [
          'npm ci',
          'npm run build',
          'npx cdk synth',
        ],
      }),
    });

    pipeline.addStage(new Application(this, 'Test', {
      env: {
        account: '632422505464',
        region: 'eu-central-1',
      },
    }));

    pipeline.addStage(new Application(this, 'Prod', {
      env: {
        account: '505825668341',
        region: 'eu-central-1',
      },
    }));
  }
}
