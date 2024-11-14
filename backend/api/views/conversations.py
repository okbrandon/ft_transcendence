import os

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from django.db.models import Count, Q

from asgiref.sync import async_to_sync

from ..models import Conversation, Relationship, User
from ..serializers import ConversationSerializer
from ..util import get_safe_profile, generate_id

class ConversationListView(APIView):

    def ensure_conversations_exist(self, user):
        friends = Relationship.objects.filter(
            Q(userA=user.userID) | Q(userB=user.userID)
        )
        friends = friends.exclude(
            Q(status=2) | Q(status=0),
            Q(userA=user.userID) | Q(userB=user.userID)
        )

        user = User.objects.get(userID=user.userID)

        for relationship in friends:
            friend_id = relationship.userA if relationship.userA != user.userID else relationship.userB

            try:
                friend = User.objects.get(userID=friend_id)
            except User.DoesNotExist:
                continue

            existing_conversation = Conversation.objects.filter(
                participants__userID__in=[user.userID, friend_id],
                conversationType='private_message'
            ).annotate(participant_count=Count('participants')).filter(participant_count=2).exists()

            if not existing_conversation:
                new_conversation = Conversation.objects.create(conversationID=generate_id("conv"), conversationType='private_message')
                new_conversation.receipientID = user.userID
                new_conversation.participants.add(user, friend)
                new_conversation.save()

    def get(self, request, *args, **kwargs):
        me = request.user

        # Ensuring conversations exist for the user
        self.ensure_conversations_exist(me)

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
