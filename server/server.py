import redis
import sys
import urllib
from urlparse import parse_qs
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
        print path

        if path[0] == 'transit':
            mode = path[0]
            address = urllib.unquote(path[1]) # Convert from URL encoded

            time = self._conn.get(address)
            if time is None:
                time = self.add_address(address, mode)

            self.send_response(200)
            self.send_header("Content-type", "text/json")
            self.end_headers()
            self.wfile.write(json.dumps({ "time": time, "status": "success" }))

        else:
            pass

    def do_POST(self):
        path = self.path.split('/')[1:]
        postvars = self.parse_POST()

        modes = ['driving', 'bicycling', 'walking']

        if path[0] in modes and 'origins' in postvars:
            time_list = self._distance_matrix_api.add_address_list(postvars['origins'], path[0])

            self.send_response(200)
            self.send_header("Content-type", "text/json")
            self.end_headers()
            self.wfile.write(json.dumps({ "time": time_list, "status": "success" }))

    def parse_POST(self):
        ctype, pdict = parse_header(self.headers['content-type'])
        if ctype == 'multipart/form-data':
            postvars = parse_multipart(self.rfile, pdict)
        elif ctype == 'application/x-www-form-urlencoded':
            length = int(self.headers['content-length'])
            postvars = parse_qs(
                    self.rfile.read(length),
                    keep_blank_values=1)
        else:
            postvars = {}
        return postvars

    def add_address(self, address, mode):
        ''' Caches and returns commute time for a single address

            address_list: Addresses for which to calculate commute time.
            mode: Type of travel. One of transit, driving, bicycling, walking
        '''

        if mode == 'transit':
            return self._distance_api.add_address(address)
        else:
            return self._distance_matrix_api.add_address_list(address)

server_address = ('', int(sys.argv[1]))
httpd = BaseHTTPServer.HTTPServer(server_address, RedisHandler)
httpd.serve_forever()
