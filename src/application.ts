import { Construct, Stage, StageProps } from '@aws-cdk/core';
import { StatefulStack } from './stateful-stack';

export class Application extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    new StatefulStack(this, 'StatefulStack');
  }
}
