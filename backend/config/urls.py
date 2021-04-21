from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path(settings.ADMIN_URL, admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('api/v1/', include('api.urls', namespace="api")),
    # path('users/', include('users.urls', namespace="users")),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)