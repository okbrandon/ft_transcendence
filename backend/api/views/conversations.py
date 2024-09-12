import os

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

#from ..models import Conversation
#from ..serializers import ConversationSerializer

#class ConversationListView(APIView):
#    def get(self, request, *args, **kwargs):
#        conversations = Conversation.objects.all()
#        serializer = ConversationSerializer(conversations, many=True)
#        return Response({'conversations': serializer.data}, status=status.HTTP_200_OK)