"""rest_test URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,re_path,include
from rest.views import RunCodeAPIView,CodeViewSet,home,js,css
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(prefix='code',viewset=CodeViewSet,base_name='code')

API_V1 = [path('run/',RunCodeAPIView.as_view(),name='run')]
API_V1.extend(router.urls)

API_VERSIONS = [path('v1/',include(API_V1))]
urlpatterns = [

    path('admin/', admin.site.urls),
    path('api/',include(API_VERSIONS)),
    path('', home, name='home'),
    re_path('(?P<filename>.*\.js)$',js,name='js'),
    re_path('(?P<filename>.*\.css)$',css,name='css'),


]
