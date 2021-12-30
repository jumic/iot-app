import * as dynamodb from '@aws-cdk/aws-dynamodb';
import { Construct, Stack, StackProps } from '@aws-cdk/core';
import * as cdk from '@aws-cdk/core';


export class StatefulStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    // dummy table for deployment test
    new dynamodb.Table(this, 'DummyTable', {
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}
