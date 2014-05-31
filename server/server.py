import redis
import re
import SocketServer
import urllib
import json

class RedisHandler(SocketServer.BaseRequestHandler):
    """
    The RedisHandler responsible for querying the Redis database.
    """

    host = 'localhost'

    def __init__(self, *args, **keys):
        self._conn = redis.StrictRedis(host=self.host)
        SocketServer.BaseRequestHandler.__init__(self, *args, **keys) 
    def handle(self):
        ''' If address in DB, return it, otherwise send not found status '''

        self.data = self.request.recv(1024).strip()

        # Address is everything after slash
        encoded_address = re.match('GET \/(.*?) ', self.data).group(1)
        address = urllib.unquote(encoded_address)

        time = self._conn.get(address)
        if time is not None:
            self.request.sendall(json.dumps({ "time": time, "status": "success" }))
        else:
            self.request.sendall(json.dumps({ "status": "not found" }))

        self.request.close()

host, port = "localhost", 80

server = SocketServer.TCPServer((host, port), RedisHandler)
server.serve_forever()
