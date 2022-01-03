import * as dynamodb from "@aws-cdk/aws-dynamodb";
import { SqsEventSource } from "@aws-cdk/aws-lambda-event-sources";
import * as sqs from "@aws-cdk/aws-sqs";
import * as cdk from "@aws-cdk/core";
import { ProcessMetricsFunction } from "./lambda/process-metrics-function";

export interface BackendConstructProps {
  table: dynamodb.Table;
  iotDataQueue: sqs.Queue;
}

export class BackendConstruct extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: BackendConstructProps) {
    super(scope, id);

    const handler = new ProcessMetricsFunction(this, "ProcessMetricsFunction", {
      environment: {
        TABLE_NAME: props.table.tableName,
      },
      memorySize: 2048,
    });
    props.table.grantReadWriteData(handler);

    handler.addEventSource(new SqsEventSource(props.iotDataQueue));
  }
}
