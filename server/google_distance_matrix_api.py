from config import Config
import time
import requests
import re
from pprint import pprint

class GoogleDistanceMatrixAPI(object):
    ''' Responsible for calculating commute time using Distance Matrix API '''

    def __init__(self, config):
        self._config = config

    def add_address(self, address, mode = 'transit'):
        ''' Return commute time for a single address and cache it.

            address: Address for which to get commute time.

            Returns commute time to address
        '''

        base_url = 'https://maps.googleapis.com/maps/api/directions/json'
        formatted_addr = re.sub('#.*?(?:\s+|$)', '', address) + ', New York, New York'
        params = {
                'key': self._config.api_key,
                'origin': re.sub('#.*?(?:\s+|$)', '', address) + ', New York, New York',
                'destination': self._config.destination,
                'sensor': False,
                'mode': mode,
                'arrival_time': '1401109200',
        }

        # Loop API call until success
        while True:
            try:
                r = requests.get(base_url, params = params)
                route_time = r.json()['routes'][0]['legs'][0]['duration']
                time_text = route_time['text']
                self._conn.set(address, time_text)
                return time_text

            except Exception as e:
                print e
                time.sleep(1)

    def add_address_list(self, address_list, mode):
        ''' Return commute times for list of addresses.

            address_list: List of addresses for which to get commute time.

            Returns list of commute times in same order as addresses.
        '''

        # Remove floor/apartment number and add New York, New York
        origins = map(lambda x: re.sub('#.*?(?:\s+|$)', '', x) + ', New York, New York', address_list)
        origins = '|'.join(origins)

        base_url = 'https://maps.googleapis.com/maps/api/distancematrix/json'
        params = {
                'key': self._config.api_key,
                'origins': origins,
                'destinations': [self._config.destination],
                'mode': mode,
        }

        r = requests.get(base_url, params = params)
        rows = r.json()['rows']
        time_text  = map(lambda x: x['elements'][0]['duration']['text'], rows)

        return time_text
