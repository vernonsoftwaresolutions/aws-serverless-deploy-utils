#!/usr/bin/env node
'use strict'
/**
 * Declare dependencies
 */
const winston = require('winston')
const fs = require('fs')
const modifyFiles = require('./utils').modifyFiles
const packageJson = require('./package.json')

//Create and declare log level
//todo-this isn't working
const logLevel = process.env.LOG_LEVEL || 'info'
console.log(logLevel)
var logger = new (winston.Logger)({

  });
  
logger.add(winston.transports.Console, {
    level: logLevel,
    prettyPrint: true,
    colorize: true,
    silent: false,
    timestamp: false
  });
  
logger.info("logging level set to ", logLevel)
  
/**
 * Declare static parameters
 */
const config = packageJson.config
const proxyFile = './simple-proxy-api.yaml'
const cloudformationFile = './cloudformation.yaml'
const packageJsonFile = 'package.json'

const configTemplate = {
    "s3BucketName": "YOUR_UNIQUE_BUCKET_NAME",
    "region": "YOUR_AWS_REGION",
    "cloudFormationStackName": "YOUR_STACK_NAME",
    "functionName": "YOUR_SERVERLESS_EXPRESS_LAMBDA_FUNCTION_NAME",
    "accountId": "YOUR_ACCOUNT_ID",
    "dnsname": "YOUR_DNS_NAME",
    "hostedzonename": "YOUR_HOSTED_ZONE_NAME",
    "cfStage": "YOUR_STAGE"
  }

logger.info("modifying proxy ", proxyFile,  " and cloudformation ",  cloudformationFile, "files ")

modifyFiles([proxyFile, cloudformationFile], [{
    regexp: new RegExp(config.accountId, 'g'),
    replacement: 'YOUR_ACCOUNT_ID'
}, {
    regexp: new RegExp(config.region, 'g'),
    replacement: 'YOUR_AWS_REGION'
}, {
    regexp: new RegExp(config.s3BucketName, 'g'),
    replacement: 'YOUR_UNIQUE_BUCKET_NAME'
}, {
    regexp: new RegExp(config.functionName, 'g'),
    replacement: 'YOUR_SERVERLESS_EXPRESS_LAMBDA_FUNCTION_NAME'
}, {
    regexp: new RegExp(config.hostedzonename, 'g'),
    replacement: 'YOUR_HOSTED_ZONE_NAME'
}, {
    regexp: new RegExp(config.dnsname, 'g'),
    replacement: 'YOUR_DNS_NAME'
}, {
    regexp: new RegExp(config.cloudFormationStackName, 'g'),
    replacement: 'YOUR_STACK_NAME'
}])

//todo-refactor to utils
logger.info("about to replace package.json config ", packageJson, " with ", configTemplate)

packageJson.config = configTemplate;

logger.info("replaces", packageJsonFile, " package.json config ", packageJson)

fs.writeFileSync(packageJsonFile,JSON.stringify(packageJson, null, 4),'utf8')

logger.info("replaced?")