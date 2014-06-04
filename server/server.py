import redis
import urllib
import json
import BaseHTTPServer
from cgi import parse_header, parse_multipart
from config import Config
from google_distance_api import GoogleDistanceAPI
from google_distance_matrix_api import GoogleDistanceMatrixAPI

class RedisHandler(BaseHTTPServer.BaseHTTPRequestHandler, object):

    _host = 'localhost'

    def __init__(self, *args, **kwargs):
        self._conn = redis.StrictRedis(host=self._host)
        self._config = Config()
        self._distance_api = GoogleDistanceAPI(self._conn, self._config)
        self._distance_matrix_api = GoogleDistanceMatrixAPI(self._config)
        super(RedisHandler, self).__init__(*args, **kwargs)

    def do_GET(self):
        path = self.path.split('/')[1:]

        modes = ['transit', 'driving', 'bicycling', 'walking']

        if path[0] in modes:
            mode = path[0]

            if mode == 'transit':
                address = urllib.unquote(path[1]) # Convert from URL encoded

                time = self._conn.get(address)
                if time is None:
                    time = self.add_address(address, mode)

                self.send_response(200)
                self.send_header("Content-type", "text/json")
                self.end_headers()
                self.wfile.write(json.dumps({ "time": time, "status": "success" }))

            else:
                address_list = path[1].split('|')
                address_list= map(lambda x: urllib.unquote(x), address_list) # Convert from URL encoded

                time_list = self._distance_matrix_api.add_address_list(address_list, path[0])

                self.send_response(200)
                self.send_header("Content-type", "text/json")
                self.end_headers()

                # If we returned a status code then there is a problem
                if type(time_list) == list:
                    self.wfile.write(json.dumps({ "time": time_list, "status": "success" }))
                else:
                    self.wfile.write(json.dumps({ "status": time_list , "status": "error" }))

        elif path[0] == 'info':
            self.send_response(200)
            self.send_header("Content-type", "text/json")
            self.end_headers()
            self.wfile.write(json.dumps({ "info": self._config.server_name, "status": "success" }))

        else:
            pass

    def add_address(self, address, mode):
        ''' Caches and returns commute time for a single address

            address_list: Addresses for which to calculate commute time.
            mode: Type of travel. One of transit, driving, bicycling, walking
        '''

        if mode == 'transit':
            return self._distance_api.add_address(address)
        else:
            return self._distance_matrix_api.add_address_list(address)

server_address = ('', 80)
httpd = BaseHTTPServer.HTTPServer(server_address, RedisHandler)
httpd.serve_forever()
