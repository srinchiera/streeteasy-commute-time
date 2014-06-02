import redis
import requests
import time
import re
import SocketServer
import urllib
import json
from config import Config

class RedisHandler(SocketServer.BaseRequestHandler):
    """
    The RedisHandler responsible for querying the Redis database.
    """

    host = 'localhost'

    def __init__(self, *args, **keys):
        self._conn = redis.StrictRedis(host=self.host)
        self._config = Config()
        SocketServer.BaseRequestHandler.__init__(self, *args, **keys)

    def handle(self):
        ''' Return transit time to address.

            If addres is already in DB we return it. If not, we query Google
            API, store it, and then return it.
        '''

        self.data = self.request.recv(1024).strip()

        try:
            # Address is everything after slash
            encoded_address = re.match('GET \/(.*?) ', self.data).group(1)
            address = urllib.unquote(encoded_address)

            time = self._conn.get(address)
            if time is not None:
                print "Already have {0}".format(address)
                self.request.sendall(json.dumps({ "time": time, "status": "success" }))
            else:
                print "Dont have getting {0}".format(address)
                time = self.add_address(address)
                self.request.sendall(json.dumps({ "time": time, "status": "not found" }))

        except Exception as e:
            print e
            self.request.sendall(json.dumps({ "status": "error" }))

        self.request.close()

    def add_address(self, addr):
        ''' Add address to redis database. '''

        base_url = 'https://maps.googleapis.com/maps/api/directions/json'
        formatted_addr = re.sub('#.*?(?:\s+|$)', '', addr) + ', New York, New York'
        params = {
                'key': self._config.api_key,
                'origin': formatted_addr,
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

host, port = "localhost", 80
server = SocketServer.TCPServer((host, port), RedisHandler)
server.serve_forever()
