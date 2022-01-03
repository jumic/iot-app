import log from "lambda-log";
import { Metric } from "./entities/metric";
import { MetricService } from "./services/metric-service";

export const handler: AWSLambda.SQSHandler = async (
  event: AWSLambda.SQSEvent
) => {
  log.info("Calling handler with data", { event });

  for (const record of event.Records) {
    log.info("record", { body: record.body });

    const parsedBody = JSON.parse(record.body);
    const topic: string = parsedBody.topic;

    const topicParts = topic.split("/");
    const deviceId = topicParts[1];

    if (topicParts[4] === "msTemperatureMeasurement") {
      const value = parsedBody.data.measuredValue;
      const type = "temperature";
      await MetricService.createMetric(
        new Metric(deviceId, new Date().toISOString(), type, value)
      );
    }
  }
};
