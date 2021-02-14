from .serializers import ProductSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Product


@api_view(['GET'])
def getRoutes(request):
    routes = [
        'api/products/'
        'api/products/create/'

        'api/products/upload/'

        'api/products/reviews/'

        'api/products/top/'
        'api/products/<id>/'

        'api/products/delete/<id>/'
        'api/products/<update>/<id>/'
    ]
    return Response(routes)


@api_view(['GET'])
def getProducts(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getProduct(request, pk):
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)
