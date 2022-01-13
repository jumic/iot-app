import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import * as sqs from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";
import { ProcessMetricsFunction } from "./lambda/process-metrics-function";

export interface BackendConstructProps {
  table: dynamodb.Table;
  iotDataQueue: sqs.Queue;
}

export class BackendConstruct extends Construct {
  constructor(scope: Construct, id: string, props: BackendConstructProps) {
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
