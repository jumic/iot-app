import { App } from "@aws-cdk/core";
import * as cdk from "@aws-cdk/core";
import { BackendConstruct } from "./backend-stack";
import { PipelineStack } from "./pipeline-stack";
import { StatefulConstruct } from "./stateful-stack";

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

export interface IotDevStackProps extends cdk.StackProps {}

export class IotDevStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: IotDevStackProps) {
    super(scope, id, props);

    const stateful = new StatefulConstruct(this, "StatefulConstruct", {
      iotTopicPrefix: "dev",
    });

    new BackendConstruct(this, "BackendConstruct", {
      table: stateful.table,
      iotDataQueue: stateful.iotDataQueue,
    });
  }
}

new IotDevStack(app, "IotDevStack", { env: devEnv });

new PipelineStack(app, "IotAppPipelineStack", {
  env: {
    account: "624132653920",
    region: "eu-central-1",
  },
});

app.synth();
