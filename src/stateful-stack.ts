import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as iam from "@aws-cdk/aws-iam";
import * as iot from "@aws-cdk/aws-iot";
import * as sqs from "@aws-cdk/aws-sqs";
import * as cdk from "@aws-cdk/core";

export interface StatefulConstructProps {
  iotTopicPrefix: string;
}

export class StatefulConstruct extends cdk.Construct {
  readonly table: dynamodb.Table;
  readonly iotDataQueue: sqs.Queue;

  constructor(scope: cdk.Construct, id: string, props: StatefulConstructProps) {
    super(scope, id);

    this.iotDataQueue = new sqs.Queue(this, "IotQueue");

    const queuRole = new iam.Role(this, "QueueRole", {
      assumedBy: new iam.ServicePrincipal("iot.amazonaws.com"),
    });
    this.iotDataQueue.grantSendMessages(queuRole);

    new iot.CfnTopicRule(this, "IotForwardingRole", {
      topicRulePayload: {
        actions: [
          {
            sqs: {
              queueUrl: this.iotDataQueue.queueUrl,
              roleArn: queuRole.roleArn,
            },
          },
        ],
        ruleDisabled: false,
        sql: `SELECT * as data, topic() as topic, timestamp() as timestamp FROM \'${props.iotTopicPrefix}/#\'`,
        awsIotSqlVersion: "2016-03-23",
      },
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
