"""
Django settings for backend project.
Auto-detects production (Vercel) vs development mode.
"""
from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent


# ── Environment detection ──────────────────────────────────────────────────────
IS_PRODUCTION = bool(os.environ.get('RENDER')) or os.environ.get('DJANGO_PRODUCTION', 'false').lower() in ('true', '1', 'yes')

# ── Helper to build URL for media fallback ─────────────────────────────────────
def _vercel_url():
    vu = os.environ.get('VERCEL_URL', '')
    # Strip trailing slash
    return vu.rstrip('/') if vu else ''


# ── Security ──────────────────────────────────────────────────────────────────
SECRET_KEY = os.environ.get(
    'DJANGO_SECRET_KEY',
    'django-insecure-h5)o^bz-y-c-&ha52j8_mva8(1&6x)*iy%f*zjpfd(9#pnab9r'
)

DEBUG = os.environ.get('DJANGO_DEBUG', str(not IS_PRODUCTION)).lower() in ('true', '1', 'yes')

if IS_PRODUCTION:
    ALLOWED_HOSTS = [
        '.onrender.com',
        os.environ.get('DJANGO_ALLOWED_HOSTS', ''),
    ]
    ALLOWED_HOSTS = [h for h in ALLOWED_HOSTS if h]
else:
    ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'cloudinary_storage',
    'cloudinary',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'book',
]

AUTH_USER_MODEL = 'book.User'

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# ── CORS ──────────────────────────────────────────────────────────────────────
if IS_PRODUCTION:
    CORS_ALLOWED_ORIGINS = [
        os.environ.get('FRONTEND_URL', ''),
    ]
    CORS_ALLOWED_ORIGINS = [o for o in CORS_ALLOWED_ORIGINS if o]
else:
    _frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
    CORS_ALLOWED_ORIGINS = [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:5174',
        'http://127.0.0.1:5174',
        'http://localhost:5175',
        'http://127.0.0.1:5175',
        'http://localhost:5176',
        'http://127.0.0.1:5176',
        'http://localhost:5177',
        'http://127.0.0.1:5177',
        _frontend_url,
    ]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = ['DELETE', 'GET', 'OPTIONS', 'PATCH', 'POST', 'PUT']
CORS_ALLOW_HEADERS = [
    'accept', 'authorization', 'content-type', 'origin', 'x-requested-with',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
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

WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# ────────────────────────────────────────────────────────────────────────────────
if IS_PRODUCTION:
    import urllib.parse
    database_url = os.environ.get('DATABASE_URL', '')
    if database_url:
        parsed = urllib.parse.urlparse(database_url)
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.postgresql',
                'NAME': parsed.path.lstrip('/'),
                'USER': parsed.username,
                'PASSWORD': parsed.password,
                'HOST': parsed.hostname,
                'PORT': parsed.port or 5432,
            }
        }
    else:
        # Fallback to SQLite (won't persist across serverless invocations)
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': '/tmp/db.sqlite3',
            }
        }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }


# Password validation

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Django REST Framework

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

# Internationalization

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# Static files (CSS, JavaScript, Images)
# ────────────────────────────────────────────────────────────────────────────────
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

import cloudinary

CLOUDINARY_STORAGE = {
    'CLOUD_NAME': os.environ.get('CLOUDINARY_CLOUD_NAME'),
    'API_KEY': os.environ.get('CLOUDINARY_API_KEY'),
    'API_SECRET': os.environ.get('CLOUDINARY_API_SECRET'),
}

DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'

# Media files (user uploads)
# ────────────────────────────────────────────────────────────────────────────────
# Note: In production, media files won't persist across serverless instances.
# Use a CDN / cloud storage (e.g. AWS S3, Cloudinary) for uploaded images.
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'


# ── Production security overrides ──────────────────────────────────────────────
if IS_PRODUCTION:
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

