#!/usr/bin/env node
'use strict'
/**
 * Declare dependencies
 */
const fs = require('fs')
const modifyFiles = require('./utils').modifyFiles
  
module.exports.run = function(configTemplate, packageFile, proxy, cloudformation){
    const packageJson = require(packageFile)

    const config = packageJson.config
    
    //todo-refactor to utils
    packageJson.config = configTemplate;
    if(packageFile){
        fs.writeFileSync(packageFile,JSON.stringify(packageJson, null, 4),'utf8')
    }
    if(proxy){
        modifyFile(proxy, config)
    }
    if(cloudformation){
        modifyFile(cloudformation, config)
    }
   
}
//todo-this all still needs to be refactored
const modifyFile = function(file, config){
    modifyFiles([file], [{
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
}