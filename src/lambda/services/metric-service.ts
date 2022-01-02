import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { Metric } from '../entities/metric';

export class MetricService {

  public static async createMetric(metric: Metric) {
    const client = new DynamoDBClient({});

    const ddbDocClient = DynamoDBDocument.from(client);
    await ddbDocClient.put({
      Item: metric.toItem(),
      TableName: process.env.TABLE_NAME,
    });

  }
}