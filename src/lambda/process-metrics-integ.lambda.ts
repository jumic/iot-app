import { TextEncoder } from "util";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import {
  IoTDataPlaneClient,
  PublishCommand,
} from "@aws-sdk/client-iot-data-plane";
import log from "lambda-log";

export async function handler(event: any) {
  log.info("Calling handler with data", { event });

  const iot = new IoTDataPlaneClient({});
  const publishCommand = new PublishCommand({
    topic:
      "integ/0x00158d0005829a78/attributeReport/1/msTemperatureMeasurement",
    payload: new TextEncoder().encode(
      JSON.stringify({
        measuredValue: 1212,
      })
    ),
  });

  const publishResponse = await iot.send(publishCommand);
  log.info("publishResponse", {
    httpStatusCode: publishResponse.$metadata.httpStatusCode,
  });

  // wait until message is processed
  await new Promise((f) => setTimeout(f, 3000));

  const client = new DynamoDBClient({});
  const send = await client.send(
    new ScanCommand({
      TableName: process.env.TABLE_NAME,
    })
  );

  log.info("dynamodb length", { length: send.Items?.length });

  if (send.Items?.length != 1) {
    throw Error("missing value");
  } else {
    const record = send.Items[0];
    log.info("item", { record });
  }
}
