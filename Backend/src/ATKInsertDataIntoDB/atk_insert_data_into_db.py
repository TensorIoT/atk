import boto3
from botocore.exceptions import ClientError
import time
import json
import os
import decimal
from boto3.dynamodb.conditions import Key, Attr


dynamodb = boto3.resource('dynamodb')
atk_device_list_table = dynamodb.Table(os.environ['ATKDeviceListTableName'])
atk_device_data_table = dynamodb.Table(os.environ['ATKDeviceDataTableName'])

iot_client = boto3.client('iot')

def lambda_handler(event, context):
    # TODO implement
    if 'DevEUI' not in event:
        print('No DevEUI Present')
        return ''
    if event['DevEUI'] == '02-00-00-01-00-00-FF-05' or event['DevEUI'] == '02-00-00-01-00-00-FF-04':
        print('Demo Devices.  so skipping')
        return ''
    print(event)
    event['DEVEUI'] = event['DevEUI']
    event['TSTAMP'] = int(time.time())
    dev_eui = event['DEVEUI']
    event['USERID'] = dev_eui
    thing_parser_name = None
    try:
        iot_thing_response = iot_client.describe_thing(
            thingName=dev_eui
        )
        print(iot_thing_response)
        if 'attributes' not in iot_thing_response:
            print(' Doesnt have thing type attributes ')
            return ''
        if 'parser' not in iot_thing_response['attributes']:
            print(' Doesnt have thing type attribute parser ')
            return ''            
        thing_parser_name = iot_thing_response['attributes']['parser']
    except Exception as e:
        print(" Get Thing Error ")
        print(e)
        return ''
    if thing_parser_name != 'tracknet_tracker_industrialtracker_v10':
        print(" Not of the type industrial tracker ")
        return ''
        
    try:
        response = atk_device_list_table.get_item(Key={'DEVEUI': dev_eui})
    except ClientError as e:
        print(e.response['Error']['Message'])
    
    if 'Item' in response:
        event['USERID'] = response['Item']['USERID']
        try:
            item = response['Item']
            item['LAST_MESSAGE'] = (event['TSTAMP'])
            if 'status' in event:
                if 'battLevel' in event['status']:
                    item['BATTERY_PERCENTAGE'] = str(event['status']['battLevel'])
            response = atk_device_list_table.put_item(Item=item)
        except ClientError as e:
            print(e.response['Error']['Message'])
    else:
        try:
            item = {}
            item['LAST_MESSAGE'] = event['TSTAMP']
            item['DEVEUI'] = event['DevEUI']
            item['USERID'] = event['USERID']
            item['DEVICE_NAME'] = event['DEVEUI']
            item['UPDATE_RATE'] = 'LOWEST'
            item['BATTERY_LIFE'] = 'HIGHEST'
            item['SIGNAL_STRENGTH'] = '-88'
            if 'status' in event:
                if 'battLevel' in event['status']:
                    item['BATTERY_PERCENTAGE'] = str(event['status']['battLevel'])
            response = atk_device_list_table.put_item(Item=item)
        except ClientError as e:
            print(e.response['Error']['Message'])
        
    
    if 'msgtype' not in event:
        return ''
    
    if event['msgtype'] == 'motion':
        item = {}
        item['DEVEUI'] = event['DEVEUI']
        item['USERID'] = event['USERID']
        item['TSTAMP'] = event['TSTAMP']
        item['USERID'] = event['USERID']
        item['LAT'] = str(event['status']['lat'])
        item['LON'] = str(event['status']['lon'])
        item['ACC'] = str(event['status']['acc'])
        item['TEMP_C'] = str(event['status']['tempC'])
        item['BATTERY_PERCENTAGE'] = str(event['status']['battLevel'])
        item['GPS_FIX'] = str(event['status']['gpsfix'])
        item['GPS_OK'] = str(event['status']['gpsok'])
        item['PARKED'] = str(event['status']['parked'])
        item['STOPPED'] = str(event['status']['stopped'])
        item['F_CNT_UP'] = str(event['FCntUp'])
        response = atk_device_data_table.put_item(Item=item)
    
    return ''