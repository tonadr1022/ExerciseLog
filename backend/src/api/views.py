from django.shortcuts import render
from rest_framework import viewsets
from .models import Exercise, WeatherInstance, Shoe
from .serializers import ExerciseSerializer, ShoeSerializer, WeatherInstanceSerializer, ExerciseReadOnlySerializer, ShoeReadOnlySerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django import http
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny


class WeatherInstanceListView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        weather = WeatherInstance.objects.all()
        serializer = WeatherInstanceSerializer(weather, many=True)
        return Response(serializer.data)


class ShoesAllUsersListView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        queryset = Shoe.objects.filter(is_public=True)
        serializer = ShoeReadOnlySerializer(
            queryset, context={'request': request}, many=True)
        return Response(serializer.data)


class ExercisesAllUsersListView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, format=None):
        exercise = Exercise.objects.filter(is_public=True)
        serializer = ExerciseReadOnlySerializer(exercise, many=True)
        return Response(serializer.data)


class ExerciseViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer

    def get_queryset(self):
        """
        This view should return a list of all the exercises
        for the currently authenticated user.
        """
        user = self.request.user
        return self.queryset.filter(user=user)


class ShoeViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Shoe.objects.all()
    serializer_class = ShoeSerializer

    def get_queryset(self):
        """
        This view should return a list of all the exercises
        for the currently authenticated user.
        """
        user = self.request.user
        return self.queryset.filter(user=user)


# class ExerciseListView(APIView):
#     def get(self, request, format=None):
#         exercises = Exercise.objects.all()
#         serializer = ExerciseSerializer(exercises, many=True)
#         return Response(serializer.data)

#     def post(self, request, format=None):
#         serializer = ExerciseSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class ShoeListView(APIView):
#     def get(self, request, format=None):
#         shoes = Shoe.objects.all()
#         serializer = ShoeSerializer(shoes, many=True)
#         return Response(serializer.data)

#     def post(self, request, format=None):
#         serializer = ShoeSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class ShoeDetailView(APIView):
#     def get_object(self, pk):
#         try:
#             return Shoe.objects.get(pk=pk)
#         except Shoe.DoesNotExist:
#             raise http.Http404

#     def get(self, request, pk, format=None):
#         shoe = self.get_object(pk)
#         serializer = ShoeSerializer(shoe)
#         return Response(serializer.data)

#     def put(self, request, pk, format=None):
#         snippet = self.get_object(pk)
#         serializer = ShoeSerializer(snippet, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def delete(self, request, pk, format=None):
#         shoe = self.get_object(pk)
#         shoe.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)


# class ExerciseDetailView(APIView):
#     def get_object(self, pk):
#         try:
#             return Exercise.objects.get(pk=pk)
#         except Exercise.DoesNotExist:
#             raise http.Http404

#     def get(self, request, pk, format=None):
#         exercise = self.get_object(pk)
#         serializer = ExerciseSerializer(exercise)
#         return Response(serializer.data)

#     def put(self, request, pk, format=None):
#         snippet = self.get_object(pk)
#         serializer = ExerciseSerializer(snippet, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def delete(self, request, pk, format=None):
#         exercise = self.get_object(pk)
#         exercise.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)
