'use strict'

const fs = require('fs')
const exec = require('child_process').execSync
const modifyFiles = require('./utils').modifyFiles

module.exports.run = function(packageFile, proxy, cloudformation, accountId, bucketName, 
    functionName, dnsname, hostedzonename, stage, region, stackname){

    modifyFiles([proxy, packageFile, cloudformation], [{
        regexp: /YOUR_ACCOUNT_ID/g,
        replacement: accountId
    }, {
        regexp: /YOUR_AWS_REGION/g,
        replacement: region
    }, {
        regexp: /YOUR_UNIQUE_BUCKET_NAME/g,
        replacement: bucketName
    }, {
        regexp: /YOUR_SERVERLESS_EXPRESS_LAMBDA_FUNCTION_NAME/g,
        replacement: functionName
    }, {
        regexp: /YOUR_HOSTED_ZONE_NAME/g,
        replacement: hostedzonename
    }, {
        regexp: /YOUR_DNS_NAME/g,
        replacement: dnsname
    }, {
        regexp: /YOUR_STACK_NAME/g,
        replacement: stackname
    },{
        regexp: /YOUR_STAGE/g,
        replacement: stage
    }])

}