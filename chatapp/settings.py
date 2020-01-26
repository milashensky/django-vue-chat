import os


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE_NAME = os.path.basename(BASE_DIR)

SECRET_KEY = 'mm_e#jntp2usm)(((u7q##4!+)_9gg-xs@@29!5-*4oc3hv1cf'

DEBUG = False
DEBUG_TOOLBAR = False
ALLOWED_HOSTS = ['chatapp.loc']
ANONYMOUS_USER_ID = -1

SERIALIZATION_MODULES = {
    'json': 'common.json'
}

DOMAIN = 'chatapp.loc'
SESSION_COOKIE_DOMAIN = CSRF_COOKIE_DOMAIN = '.%s' % DOMAIN
SESSION_COOKIE_HTTPONLY = False
MESSAGE_FETCH_POOL_SIZE = 40

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'common',
    'chat',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'chatapp.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'chatapp.wsgi.application'


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'chat',
        'USER': 'chat',
        'PASSWORD': 'chat',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}


AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

STATIC_URL = '/static/'

###########################
# Load LOCAL_SETTINGS
###########################
try:
    from types import ModuleType
    import local_settings
    for key in dir(local_settings):
        value = getattr(local_settings, key)
        if not key.startswith('__') and not isinstance(value, ModuleType):
            globals()[key] = value
except ImportError:
    raise
