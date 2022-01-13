const { awscdk } = require("projen");
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: "2.0.0",
  defaultReleaseBranch: "main",
  name: "iot-app",
  repository: "https://github.com/jumic/iot-app/",

  autoApproveUpgrades: true,
  autoApproveOptions: {
    allowedUsernames: ["jumic", "jumic-automation"],
    secret: "GITHUB_TOKEN",
  },

  codeCov: true,
  prettier: true,

  devDeps: [
    "@aws-sdk/client-iot-data-plane",
    "@types/aws-lambda",
    "cdk-triggers",
    "@types/lambda-log",
    "lambda-log",
  ],

  deps: ["@aws-sdk/client-dynamodb", "@aws-sdk/lib-dynamodb"],

  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // packageName: undefined,  /* The 'name' in package.json. */
  // release: undefined,      /* Add release management to this project. */

  lambdaOptions: {
    // target node.js runtime
    runtime: awscdk.LambdaRuntime.NODEJS_16_X,
  },
});
const deploy = project.addTask("devdeploy");
deploy.exec("cdk deploy IotDevStack");

const hotswap = project.addTask("devhotswap");
hotswap.exec("cdk deploy --hotswap IotDevStack");
hotswap.exec("cdk watch IotDevStack");

project.upgradeWorkflow?.postUpgradeTask.spawn(project.tasks.tryFind("bundle"));
project.upgradeWorkflow?.postUpgradeTask.spawn(
  project.tasks.tryFind("test:update")
);
project.upgradeWorkflow?.postUpgradeTask.spawn(
  project.tasks.tryFind("integ:process-metrics:snapshot")
);

project.synth();
