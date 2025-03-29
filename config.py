import os

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'user': 'piyush',
    'password': 'your_password',
    'database': 'cyclesync'
}

# Flask application configuration
class Config:
    SECRET_KEY = os.environ.get('SESSION_SECRET', 'default_dev_key_1234')
    SQLALCHEMY_DATABASE_URI = f"mysql://{DB_CONFIG['user']}:{DB_CONFIG['password']}@{DB_CONFIG['host']}/{DB_CONFIG['database']}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_recycle": 300,
        "pool_pre_ping": True,
    }
