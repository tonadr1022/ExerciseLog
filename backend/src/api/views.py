from django.shortcuts import render
from rest_framework import viewsets
from .models import Exercise, WeatherInstance, Shoe, Map
from .serializers import ExerciseSerializer, ShoeSerializer, WeatherInstanceSerializer, ExerciseReadOnlySerializer, ShoeReadOnlySerializer
from . import serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django import http
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from users.models import NewUser
from rest_framework.pagination import PageNumberPagination
from . import datetime_utils
from django.utils import timezone


class WeatherInstanceListView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        weather = WeatherInstance.objects.all()
        serializer = WeatherInstanceSerializer(weather, many=True)
        return Response(serializer.data)


class ShoesAllUsersListView(APIView):
    permission_classes = (IsAuthenticated,)
    pagination_class = None

    def get(self, request, format=None):
        queryset = Shoe.objects.filter(is_public=True)
        serializer = ShoeReadOnlySerializer(
            queryset, context={'request': request}, many=True)
        return Response(serializer.data)


class ExercisesAllUsersListView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        exercises = Exercise.objects.filter(is_public=True)
        paginator = PageNumberPagination()
        paginator.page_size = 24
        result_page = paginator.paginate_queryset(exercises, request)
        serializer = ExerciseReadOnlySerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)


class ExerciseViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer
    # pagination_class = PageNumberPagination

    def get_serializer_class(self):
        if 'summary' in self.request.query_params:  # type: ignore
            return serializers.ExerciseSlimSerializer

        return super().get_serializer_class()

    def list(self, request, *args, **kwargs):
        if request.query_params.get('paginate') == 'false':
            queryset = self.filter_queryset(self.get_queryset())
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        """
        This view should return a list of all the exercises
        for the currently authenticated user.
        """
        user = self.request.user
        return self.queryset.filter(user=user)

    def destroy(self, request, pk=None):
        instance = self.get_object()
        # exercise = Exercise.objects.get(pk=pk)
        shoe = instance.shoe
        if shoe:
            shoe.distance_run -= instance.distance
            shoe.save()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class ShoeViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Shoe.objects.all()
    serializer_class = ShoeSerializer
    pagination_class = None

    def get_queryset(self):
        """
        This view should return a list of all the exercises
        for the currently authenticated user.
        """
        user = self.request.user
        return self.queryset.filter(user=user)


class WeeklySummaryView(APIView):
    # permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        user = self.request.user
        act_type = request.query_params.get('act_type', 'Run')
        act_type = act_type.capitalize()
        print(act_type)
        datetime_start_str = request.query_params.get(
            'datetime_start')  # , datetime_utils.most_recent_monday_utc())
        datetime_start = datetime_start_str
        datetime_end = request.query_params.get('datetime_end')
        exercises = Exercise.objects.filter(
            datetime_started__gte=datetime_start,
            datetime_started__lte=datetime_end).filter(act_type=act_type).filter(user=user)
        print(datetime_utils.get_recent_year_start_utc())
        yearex = Exercise.objects.filter(
            datetime_started__gte=datetime_utils.get_recent_year_start_utc()).filter(act_type='Run').values('distance')
        serializer = ExerciseSerializer(exercises, many=True)
        return Response(serializer.data)
