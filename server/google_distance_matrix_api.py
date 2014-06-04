from config import Config
import requests
import re
from pprint import pprint

class GoogleDistanceMatrixAPI(object):
    ''' Responsible for calculating commute time using Distance Matrix API '''

    def __init__(self, config):
        self._config = config

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
