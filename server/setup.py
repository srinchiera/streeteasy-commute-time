from setuptools import setup

setup(name='streeteasy_commute',
      version='0.1',
      description='Server for chrome extension',
      url='https://github.com/srinchiera/streeteasy-commute-time',
      author='',
      author_email='salvatore@rinchiera.com',
      license='MIT',
      packages=['streeteasy_commute'],
      install_requires =[
          'redis'
      ],
      zip_safe=False)
