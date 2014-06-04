class Config(object):

    config = {
              'api_key'     : 'YOUR_API_KEY',
              'destination' : 'ADRESS TO COMMUTE TO',
              'server_name' : 'SERVER NAME TO DISPLAY TO USERS'
             }

    def __init__(self):
        for key in self.config:
            setattr(self, key, self.config[key])
