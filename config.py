import os

# Flask application configuration
class Config:
    SECRET_KEY = os.environ.get('SESSION_SECRET', 'default_dev_key_1234')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_recycle": 300,
        "pool_pre_ping": True,
    }
