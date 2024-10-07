from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from ..models import StoreItem, Purchase
from ..serializers import StoreItemSerializer, PurchaseSerializer
from ..util import generate_id

class StoreItemsList(APIView):
    def get(self, request, *args, **kwargs):
        items = StoreItem.objects.all()
        serializer = StoreItemSerializer(items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class UserPurchasesList(APIView):
    def get(self, request, *args, **kwargs):
        user = request.user
        purchases = Purchase.objects.filter(userID=user.userID)
        serializer = PurchaseSerializer(purchases, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class MakePurchase(APIView):
    def post(self, request, itemID, *args, **kwargs):
        user = request.user
        item = StoreItem.objects.filter(itemID=itemID).first()

        if not item:
            return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)

        if user.money < item.price:
            return Response({"error": "Insufficient funds"}, status=status.HTTP_400_BAD_REQUEST)

        purchase = Purchase.objects.create(userID=user.userID, itemID=itemID, purchaseID=generate_id("purchase"))
        user.money -= item.price
        user.save()

        serializer = PurchaseSerializer(purchase)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
