from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from components.views.asset_type_views import *
from components.views.barangay_views import *
from components.views.municipality_views import *
from components.views.province_views import *
from components.views.bank_views import *

urlpatterns = [
    path("asset_type/", AssetTypeList.as_view()),
    path("asset_type/<int:pk>/", AssetTypeDetail.as_view()),
    path("asset_type/<str:pk_ids>/", AssetTypeList.as_view()),
    path("bank/", BankList.as_view()),
    path("bank/<int:pk>/", BankDetail.as_view()),
    path("bank/<str:pk_ids>/", BankList.as_view()),
    path("barangay/", BarangayList.as_view()),
    path("barangay/<int:pk>/", BarangayDetail.as_view()),
    path("barangay/<str:pk_ids>/", BarangayList.as_view()),
    path("municipality/", MunicipalityList.as_view()),
    path("municipality/<int:pk>/", MunicipalityDetail.as_view()),
    path("municipality/<str:pk_ids>/", MunicipalityList.as_view()),
    path("province/", ProvinceList.as_view()),
    path("province/<int:pk>/", ProvinceDetail.as_view()),
    path("province/<str:pk_ids>/", ProvinceList.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)