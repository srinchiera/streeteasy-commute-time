class Config(object):

    config = {
              'api_key'     : 'AIzaSyCE6x8u9lTvOc_rDPatzHTZ4L7sPz4f-Ak',
              'destination' : '23 W 23 Street, New York, New York'
             }

    def __init__(self):
        for key in self.config:
            setattr(self, key, self.config[key])
