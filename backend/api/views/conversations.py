import os

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import Conversation
from ..serializers import ConversationSerializer
from ..util import get_safe_profile

class ConversationListView(APIView):
    def get(self, request, *args, **kwargs):
        me = request.user
        conversations = me.conversations.all()
        serializer = ConversationSerializer(conversations, many=True)
        
        safe_conversations = serializer.data
        
        for conversation in safe_conversations:
            participants = conversation.get('participants', [])
            conversation['participants'] = get_safe_profile(participants, me=False, many=True)

        return Response({'conversations': safe_conversations}, status=status.HTTP_200_OK)