import * as iam from "@aws-cdk/aws-iam";
import { App, Duration, Stack } from "@aws-cdk/core";
import { AfterCreate } from "cdk-triggers";
import { BackendConstruct } from "../src/backend-stack";
import { ProcessMetricsIntegFunction } from "../src/lambda/process-metrics-integ-function";
import { StatefulConstruct } from "../src/stateful-stack";

const app = new App();
const stack = new Stack(app, "Test");

const stateful = new StatefulConstruct(stack, "StatefulConstruct", {
  iotTopicPrefix: "integ",
});

const backend = new BackendConstruct(stack, "BackendConstruct", {
  table: stateful.table,
  iotDataQueue: stateful.iotDataQueue,
});
const handler = new ProcessMetricsIntegFunction(
  stack,
  "ProcessMetricsIntegFunction",
  {
    environment: {
      TABLE_NAME: stateful.table.tableName,
    },
    timeout: Duration.seconds(10),
  }
);
stateful.table.grantReadData(handler);
const myPolicy = new iam.Policy(stack, "MyIotPolicy", {
  statements: [
    new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["iot:*"],
      resources: ["*"],
    }),
  ],
});
handler.role?.attachInlinePolicy(myPolicy);
stateful.table.grantReadWriteData(handler);

new AfterCreate(stack, "RunAssertions", {
  resources: [stateful, backend],
  handler,
});
