import { Template } from '@aws-cdk/assertions';
import { App } from '@aws-cdk/core';
import { StatefulStack } from '../src/stateful-stack';

test('Snapshot', () => {
  const app = new App();
  const stack = new StatefulStack(app, 'test');

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});