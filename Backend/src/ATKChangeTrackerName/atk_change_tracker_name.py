import boto3
from botocore.exceptions import ClientError
import time
import json
import os
import decimal
from boto3.dynamodb.conditions import Key, Attr


dynamodb = boto3.resource('dynamodb')
atk_device_list_table = dynamodb.Table(os.environ['ATKDeviceListTableName'])

def cors_web_response(status_code, body):
    return {
        'statusCode': status_code,
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type,Authorization,X-Amz-Date,X-API-Key,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Methods": "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
            "Access-Control-Allow-Origin": "*"
        },
        'body': json.dumps(body)
    }

def get_user_id_from_event(event):
    incoming_user_id = None
    try:
        print(event['requestContext']['authorizer']['claims']['cognito:username'])
        incoming_user_id = event['requestContext']['authorizer']['claims']['cognito:username']
    except Exception as e:
        print(e)
        return cors_web_response(400, {'Error': 'getting user id from cognito'})

    if incoming_user_id is None:
        return cors_web_response(400, {'Error': 'missing user id in cognito'})
    user_id = incoming_user_id.upper()
    return user_id

def lambda_handler(event, context):
    # TODO implement
    print(event)
    user_id = get_user_id_from_event(event)
    if 'statusCode' in user_id:
        return user_id
    incomingBody = {}
    if event['body'] is not None:
        try:
            incomingBody = json.loads(event['body'])
        except:
            return cors_web_response(400, {'Error': 'body not in json'})
    
    print(incomingBody)
    
    if 'DEVICE_NAME' not in incomingBody:
        return cors_web_response(400, {'Error': 'Must provide DEVICE_NAME'})
    if 'DEVEUI' not in incomingBody:
        return cors_web_response(400, {'Error': 'Must provide DEVEUI'})
        
    device_name = incomingBody['DEVICE_NAME']
    dev_eui = incomingBody['DEVEUI']
    
    try:
        response = atk_device_list_table.get_item(Key={'DEVEUI': dev_eui})
    except ClientError as e:
        print(e.response['Error']['Message'])
        return cors_web_response(400, e.response['Error'])
    
    if 'Item' not in response:
        return cors_web_response(400, {'Error':'Device Not Present'})
    
    print(response['Item'])
    
    item = response['Item']
    if item['USERID'] != user_id:
        return cors_web_response(401, {'Error':'Not authorized to update the device'})

    item['DEVICE_NAME'] = incomingBody['DEVICE_NAME']
    
    try:
        response = atk_device_list_table.put_item(Item=item)
    except ClientError as e:
        print(e.response['Error']['Message'])
        return cors_web_response(400, e.response['Error'])    
    
    return cors_web_response(200, {'DEVEUI':incomingBody['DEVEUI'], 'UPDATE': 'SUCCESS'})
    