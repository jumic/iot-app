import { Template } from '@aws-cdk/assertions';
import { App, Stack } from '@aws-cdk/core';
import { BackendConstruct } from '../src/backend-stack';
import { StatefulConstruct } from '../src/stateful-stack';

test('Snapshot', () => {
  const app = new App();

  const stack = new Stack(app, 'MyStack', {
  });
  const stateful = new StatefulConstruct(stack, 'StatefulConstruct', {
    iotTopicPrefix: 'dev',
  });

  new BackendConstruct(stack, 'BackendConstruct', {
    table: stateful.table,
    iotDataQueue: stateful.iotDataQueue,
  });

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});