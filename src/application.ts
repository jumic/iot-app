import { Construct, Stack, Stage, StageProps } from "@aws-cdk/core";
import { BackendConstruct } from "./backend-stack";
import { StatefulConstruct } from "./stateful-stack";

export class Application extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    const statefulStack = new Stack(this, "Stateful", {});
    const stateful = new StatefulConstruct(statefulStack, "StatefulConstruct", {
      iotTopicPrefix: "zigbee",
    });

    const backendStack = new Stack(this, "Backend", {});
    new BackendConstruct(backendStack, "BackendConstruct", {
      table: stateful.table,
      iotDataQueue: stateful.iotDataQueue,
    });
  }
}
