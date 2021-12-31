const { awscdk } = require('projen');
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '1.137.0',
  defaultReleaseBranch: 'main',
  name: 'iot-app',
  repository: 'https://github.com/jumic/iot-app/',

  autoApproveUpgrades: true,
  autoApproveOptions: {
    allowedUsernames: ['jumic', 'jumic-automation'],
    secret: 'GITHUB_TOKEN',
  },

  cdkDependencies: [
    '@aws-cdk/aws-dynamodb',
    '@aws-cdk/pipelines',
    '@aws-cdk/core',
  ],

  context: {
    '@aws-cdk/core:newStyleStackSynthesis': true,
  },

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The 'name' in package.json. */
  // release: undefined,      /* Add release management to this project. */
});
project.synth();
