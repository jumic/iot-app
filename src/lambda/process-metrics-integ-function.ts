// ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import { Construct } from '@aws-cdk/core';

/**
 * Props for ProcessMetricsIntegFunction
 */
export interface ProcessMetricsIntegFunctionProps extends lambda.FunctionOptions {
}

/**
 * An AWS Lambda function which executes src/lambda/process-metrics-integ.
 */
export class ProcessMetricsIntegFunction extends lambda.Function {
  constructor(scope: Construct, id: string, props?: ProcessMetricsIntegFunctionProps) {
    super(scope, id, {
      description: 'src/lambda/process-metrics-integ.lambda.ts',
      ...props,
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../assets/lambda/process-metrics-integ.lambda')),
    });
  }
}