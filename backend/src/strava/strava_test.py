import json
import requests
# from . import serializers
import datetime


# def get_activity():
#     object_id = 9182150299
#     strava_api_url = f"https://www.strava.com/api/v3/activities/{object_id}"
#     headers = {
#         'Authorization': 'Bearer 4877f5150600f09c901fe342a4b517dba93d7f44'
#     }
#     response = requests.get(strava_api_url, headers=headers)

#     if response.status_code == 200:
#         activity_data = response.json()
#         print(activity_data)

#         serializer = serializers.StravaActivitySerializer(
#             data=activity_data)
#         serializer.is_valid(raise_exception=True)
#         validated_data = serializer.validated_data
#         print(validated_data)

# def refresh():
#     refresh_url = f"https://www.strava.com/oauth/token/"
#     refresh_data = {
#         'client_id': '103399',
#         'client_secret': 'bcd76a46c271b862eb75985908b5a8cf59b5b4de',
#         'refresh_token': '80c8ecb58d5ba804fcb29fd39575552ebae3d6e2',
#         'grant_type': 'refresh_token'
#     }
#     refresh_response = requests.post(
#         refresh_url, data=refresh_data)
#     print('refresh response', refresh_response.status_code)
def refresh():
    refresh_url = "https://www.strava.com/api/v3/oauth/token"
    refresh_params = {
        'client_id': '103399',
        'client_secret': 'bcd76a46c271b862eb75985908b5a8cf59b5b4de',
        'grant_type': 'refresh_token',
        'refresh_token': '80c8ecb58d5ba804fcb29fd39575552ebae3d6e2',
    }
    refresh_response = requests.post(
        refresh_url, data=refresh_params)

    if refresh_response.status_code == 200:
        # Request succeeded, handle the response data
        response_data = refresh_response.json()
        expiration_time = datetime.datetime.utcfromtimestamp(
            response_data['expires_at'])
        print(datetime.datetime.utcnow() < expiration_time)
        return {'access_token': response_data['access_token'], 'expiration_time': expiration_time}
    else:
        # Request failed, handle the error
        print('Refresh request failed with status code',
              refresh_response.status_code)
        print(refresh_response.request.method)
        return None


# print(refresh())

print(json.loads('%257B%257D'))
