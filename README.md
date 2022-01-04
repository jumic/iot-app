# IoT-App

## Publish MQTT message

```bash
aws --region eu-central-1 iot-data publish --topic "dev/0x00158d0005829a78/attributeReport/1/msTemperatureMeasurement" --cli-binary-format raw-in-base64-out --payload "{ \"measuredValue\": 1234 }"
```
