import * as actions from "@aws-cdk/aws-iot-actions-alpha";
import * as iot from "@aws-cdk/aws-iot-alpha";
import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as sqs from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

export interface StatefulConstructProps {
  iotTopicPrefix: string;
}

export class StatefulConstruct extends Construct {
  readonly table: dynamodb.Table;
  readonly iotDataQueue: sqs.Queue;

  constructor(scope: Construct, id: string, props: StatefulConstructProps) {
    super(scope, id);

    this.iotDataQueue = new sqs.Queue(this, "IotQueue");

    new iot.TopicRule(this, "TopicRule", {
      sql: iot.IotSql.fromStringAsVer20160323(
        `SELECT * as data, topic() as topic, timestamp() as timestamp FROM \'${props.iotTopicPrefix}/#\'`
      ),
      actions: [new actions.SqsQueueAction(this.iotDataQueue)],
    });

    this.table = new dynamodb.Table(this, "IotTable", {
      partitionKey: {
        name: "PK",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "SK",
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}
