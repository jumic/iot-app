
export interface MetricData {
  [key: string]: any;
}

export class Metric {

  public static metricFromItem(data: MetricData) {
    if (!data.deviceId || !data.timestamp || !data.type || !data.value) {
      return new Error('missing data');
    }
    return new Metric(data.deviceId, data.timestamp, data.type, data.value);
  }

  public deviceId: string;
  public timestamp: string;
  public value: number;
  public type: string;

  constructor(deviceId: string, timestamp: string, type: string, value: number) {
    this.deviceId = deviceId;
    this.timestamp = timestamp;
    this.value = value;
    this.type = type;
  }

  pk() {
    return `DEVICEID#${this.deviceId.toLowerCase()}`;
  }

  sk() {
    return `METRIC#${this.type.toLowerCase()}#TIMESTAMP#${this.timestamp.toLowerCase()}`;
  }

  key() {
    return {
      PK: this.pk(),
      SK: this.sk(),
    };
  }
  public toItem() {
    const item: MetricData = {
      ...this.key(),
      deviceId: this.deviceId,
      timestamp: this.timestamp,
      type: this.type,
      value: this.value,
    };
    return item;
  }

}