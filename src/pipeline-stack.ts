import { Stack, StackProps } from "aws-cdk-lib";
import * as pipelines from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";
import { Application } from "./application";

// new MyStack(app, 'my-stack-prod', { env: prodEnv });
export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new pipelines.CodePipeline(this, "Pipeline", {
      pipelineName: "IoT-App",
      synth: new pipelines.ShellStep("Synth", {
        input: pipelines.CodePipelineSource.connection(
          "jumic/iot-app",
          "main",
          {
            connectionArn:
              "arn:aws:codestar-connections:eu-central-1:624132653920:connection/1edb6c36-946f-452d-a051-849b7ffbca7b",
          }
        ),
        commands: [
          "yarn install --check-files --frozen-lockfile",
          "npx projen build",
        ],
      }),
      crossAccountKeys: true,
    });

    pipeline.addStage(
      new Application(this, "Test", {
        env: {
          account: "632422505464",
          region: "eu-central-1",
        },
      })
    );

    pipeline.addStage(
      new Application(this, "Prod", {
        env: {
          account: "505825668341",
          region: "eu-central-1",
        },
      })
    );
  }
}
