from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
import subprocess
from django.db import models
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import CodeListSerializer, CodeSerializer
from .models import Code
from rest_framework.authentication import SessionAuthentication
from rest_framework.renderers import JSONRenderer

# Create your views here.
# def list(request):
#     if request.method == 'POST':
#         # code = request.POST.get('code')
#         # print(code)
#         # output = execute_code(code)
#         # s = {"name":"weikai11","password":"1234"}
#         print(1111111111111111111111111)
#         output = Code.objects.all()
#         output = CodeSerializer(output,many=True)
#         print(output)
#         # output = JSONRenderer().render(output.data)
#         return JsonResponse(output.data,safe=False)
#     else:
#         return HttpResponse("not success")
# def execute_code(self,code):
#         try:
#             output = subprocess.check_output(['python', '-c', code],
#                                              universal_newlines=True,
#                                              stderr=subprocess.STDOUT,
#                                              timeout=30)
#         except subprocess.CalledProcessError as e:
#             output = e.output
#         except subprocess.TimeoutExpired as e:
#             output = '\r\n'.join(['Time Out!!!', e.output])
#         return output
class ExecuteCodeMixin(object):
    def execute_code(self,code):
        try:
            output = subprocess.check_output(['python', '-c', code],
                                             universal_newlines=True,
                                             stderr=subprocess.STDOUT,
                                             timeout=30)
        except subprocess.CalledProcessError as e:
            output = e.output
        except subprocess.TimeoutExpired as e:
            output = '\r\n'.join(['Time Out!!!', e.output])
        return output

class CodeViewSet(ExecuteCodeMixin, ModelViewSet):
    queryset = Code.objects.all()
    serializer_class = CodeSerializer
    print(222222222222222222)
    def list(self, request, *args, **kwargs):
        """
        使用专门的列表序列化器，而非默认的序列化器
        """
        serializer = CodeListSerializer(self.get_queryset(), many=True)
        return Response(data=serializer.data)

    def run_create_or_update(self, request, serializer):
        """
        create 和 update 的共有逻辑，仅仅是简单的多了 run 参数的判断
        """
        if serializer.is_valid():
            code = serializer.validated_data.get('code')
            serializer.save()
            if 'run' in request.query_params.keys():
                print(111111111111122222222)
                output = self.execute_code(code)
                data = serializer.data
                data.update({'output': output})
                return Response(data=data, status=status.HTTP_201_CREATED)
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        return self.run_create_or_update(request, serializer)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.serializer_class(instance, data=request.data)
        return self.run_create_or_update(request, serializer)


# class CsrfExemptSessionAuthentication(SessionAuthentication):
#     """
#     去除 CSRF 检查
#     """
#
#     def enforce_csrf(self, request):
#         return

class RunCodeAPIView(ExecuteCodeMixin, APIView):

    def post(self, request, format=None):
        output = self.execute_code(request.data.get('code'))
        return Response(data={'output': output}, status=status.HTTP_200_OK)

    def get(self, request, format=None):
        try:
            code = Code.objects.get(pk=request.query_params.get('id'))
        except models.ObjectDoesNotExist:
            return Response(data={'error': 'Object Not Found'}, status=status.HTTP_404_NOT_FOUND)
        output = self.execute_code(code.code)
        return Response(data={'output': output}, status=status.HTTP_200_OK)
def home(request):
    with open('frontend/test.html', 'rb') as f:
        content = f.read()
    return HttpResponse(content)

def js(request, filename):
    with open('frontend/{}'.format(filename), 'rb') as f:
        js_content = f.read()
    return HttpResponse(content=js_content,
                        content_type='application/javascript')

def css(request, filename):
    with open('frontend/{}'.format(filename), 'rb') as f:
        css_content = f.read()
    return HttpResponse(content=css_content,
                        content_type='text/css')


