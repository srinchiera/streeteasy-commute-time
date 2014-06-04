import BaseHTTPServer
from streeteasy_commute.server import RedisHandler

server_address = ('', 80)
httpd = BaseHTTPServer.HTTPServer(server_address, RedisHandler)
httpd.serve_forever()
