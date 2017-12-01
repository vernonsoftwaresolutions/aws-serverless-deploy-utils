#!/usr/bin/env node

const program = require('commander');
const deconfigure = require('./deconfigure')
const configure = require('./configure')

const CONFIGURE = "configure"
const DECONFIGURE = "deconfigure"
//todo-refactor this
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

const availableRegions = ['us-east-1', 'us-east-2', 'us-west-1', 'us-west-2', 'eu-west-1', 'eu-west-2', 'eu-central-1', 'ap-northeast-1', 'ap-northeast-2', 'ap-southeast-1', 'ap-southeast-2']
  
program
    .arguments('<option>')
    .arguments('[packageFile]')
    .arguments('[proxy]')    
    .arguments('[cloudformation]') 
    .option(' --account-id <accountid>', 'AWS AccountId')    
    .option(' --bucket-name <bucketName>', 'AWS Bucket Name')    
    .option(' --function-name <function-name>', 'AWS Function Name')    
    .option(' --dnsname <dnsname>', 'AWS Route 53 DNS Name')    
    .option(' --hostedzonename <hostedzonename>', 'AWS Route 53 Hosted Zone Name')        
    .option(' --stage <stage>', 'Deployment Stage Name')    
    .option(' --region <region>', 'AWS Region')    
    .option(' --stackname <stackname>', 'AWS Cloudformaton Stack Name')    
    .action(function(option, packageFile, proxy, cloudformation){        
        if(option === CONFIGURE){
            if (!program.accountId || program.accountId.length !== 12) {
                console.error('You must supply a 12 digit account id as --account-id=<accountId>')
                process.exit(1)
            }
            if (!program.bucketName) {
                console.error('You must supply a bucket name as --bucket-name=<bucketName>')
                process.exit(1)
            }
            if(!program.region){
                program.region = 'us-east-1'
            }
            if(!program.functionName){
                program.functionName = 'AwsServerlessExpressFunction'
            }
            if (!program.dnsname) {
                console.error('You must supply a dns name as --dnsname=<dnsname>')
                process.exit(1)
            }
        
            if (!program.hostedzonename) {
                console.error('You must supply a hostedzonename as --hostedzonename=<hostedzonename>')
                process.exit(1)
            }
        
            if (!program.stage) {
                console.error('You must supply a stage as --stage=<stage>')
                process.exit(1)
            }
        
            if (!program.stackname) {
                console.error('You must supply a stackname as --stackname=<stackname>ß')
                process.exit(1)
            }
        
            if (availableRegions.indexOf(program.region) === -1) {
                console.error(`Amazon API Gateway and Lambda are not available in the ${program.region} region. Available regions: us-east-1, us-west-2, eu-west-1, eu-central-1, ap-northeast-1, ap-northeast-2, ap-southeast-1, ap-southeast-2`)
                process.exit(1)
            }
            configure.run(packageFile, proxy, cloudformation, program.accountId, 
                program.bucketName, program.functionName, program.dnsname, program.hostedzonename, program.stage, program.region, program.stackname)

        } else if(option === DECONFIGURE){
            deconfigure.run(configTemplate, packageFile, proxy, cloudformation);
            
        } else {
            console.log("Internal Error")
            process.exit(1)
        }
    })
    .parse(process.argv);

