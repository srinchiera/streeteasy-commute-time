from config import Config

class Transit(object):
    ''' Responsible for calculating commute time for transit '''

    def __init__(self, conn, config):
        self._conn = conn
        self._config = config


    def add_address(self, address):
        ''' Return commute time for a single address and cache it.

            address: Address for which to get commute time.

            Returns commute time to address
        '''

        base_url = 'https://maps.googleapis.com/maps/api/directions/json'
        formatted_addr = re.sub('#.*?(?:\s+|$)', '', addr) + ', New York, New York'
        params = {
                'key': self._config.api_key,
                'origin': re.sub('#.*?(?:\s+|$)', '', address) + ', New York, New York'
                'destination': self._config.destination,
                'sensor': False,
                'mode': 'transit',
                'arrival_time': '1401109200',
        }

        # Loop API call until success
        while True:
            try:
                r = requests.get(base_url, params = params)
                route_time = r.json()['routes'][0]['legs'][0]['duration']
                time_text = route_time['text']
                self._conn.set(addr, time_text)
                return time_text

            except Exception as e:
                print e
                time.sleep(1)

    def add_addresses(self, address_list):
        ''' Return commute times for list of addresses and caches them.

            address_list: List of addresses for which to get commute time.

            Returns list of commute times in same order as addresses.
        '''

        base_url = 'https://maps.googleapis.com/maps/api/directions/json'
        formatted_addr = re.sub('#.*?(?:\s+|$)', '', addr) + ', New York, New York'
        params = {
                'key': self._config.api_key,
                'destination': self._config.destination,
                'sensor': False,
                'mode': 'transit',
                'arrival_time': '1401109200',
        }

        transit_times = []
        for address in address_list:
            params['origin'] = re.sub('#.*?(?:\s+|$)', '', address) + ', New York, New York'

            # Loop API call until success
            while True:
                try:
                    r = requests.get(base_url, params = params)
                    route_time = r.json()['routes'][0]['legs'][0]['duration']
                    time_text = route_time['text']
                    self._conn.set(addr, time_text)
                    transit_times.append(time_text)

                except Exception as e:
                    print e
                    time.sleep(1)

        return transit_times

