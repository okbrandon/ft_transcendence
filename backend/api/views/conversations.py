from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from ..serializers import ConversationSerializer
from ..util import get_safe_profile

class ConversationListView(APIView):

    def get(self, request, *args, **kwargs):
        me = request.user

        conversations = me.conversations.all()
        serializer = ConversationSerializer(conversations, many=True)

        safe_conversations = serializer.data

        for conversation in safe_conversations:
            # Extract sensitive information from participants
            participants = conversation.get('participants', [])
            conversation['participants'] = get_safe_profile(participants, me=False, many=True)

            # Extract sensitive information from messages
            messages = conversation.get('messages', [])
            for message in messages:
                sender = message.get('sender', {})
                message['sender'] = get_safe_profile(sender, me=False)

        return Response({'conversations': safe_conversations}, status=status.HTTP_200_OK)
