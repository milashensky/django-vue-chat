from django.contrib import admin
from django.urls import path
from django.conf.urls import include, url
from django.conf import settings


urlpatterns = [
    path('api/common/', include(('common.urls', 'common'), namespace='common')),
    # path('api/chat/', include(('chat.urls', 'chat'), namespace='chat')),
    path('admin/', admin.site.urls),
]


if getattr(settings, 'DEBUG_TOOLBAR', None):
    import debug_toolbar
    urlpatterns = [
        url(r'^__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns
