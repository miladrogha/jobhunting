# __init__.py example

__all__ = ['analysis'] # Controls what gets imported with from package import *
__version__ = "1.0.0"

import logging
logging.basicConfig(level=logging.INFO)

def package_function():
    print("This is a function from the package.")