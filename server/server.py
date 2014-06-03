import redis
import requests
import time
import re
import SocketServer
import urllib
import json
from config import Config
from transit import Transit

class RedisHandler(SocketServer.BaseRequestHandler):
    """
    The RedisHandler responsible for querying the Redis database.
    """

    host = 'localhost'

    def __init__(self, *args, **keys):
        self._conn = redis.StrictRedis(host=self.host)
        self._config = Config()
        selfe._transit = Transit(self._conn, self._config)
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

    def add_address(self, address, mode):
        ''' Caches and returns commute time for a single address

            address_list: Addresses for which to calculate commute time.
            mode: Type of travel. One of transit, driving, bicycling, walking
        '''

        if mode == 'transit':
            return self._transit.add_address(address)

    def add_addresses(self, address_list, mode):
        ''' Caches and returns commute time for a list of addresses

            address_list: List of addresses for which to calculate commute time.
            mode: Type of travel. One of transit, driving, bicycling, walking
        '''

        if mode == 'transit':
            return self._transit.add_addresses(address_list)

host, port = "localhost", 80
server = SocketServer.TCPServer((host, port), RedisHandler)
server.serve_forever()
