from django.http import HttpResponseForbidden
from django.utils.deprecation import MiddlewareMixin

import logging

class InternalOnlyMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if request.path.startswith('/__internal/'):
            remote_addr = request.META.get('REMOTE_ADDR')
            logging.info(f"InternalOnlyMiddleware: Access attempt from {remote_addr}")
            if not (remote_addr.startswith('172.18.') or remote_addr in ['127.0.0.1', '::1']):
                logging.warning(f"InternalOnlyMiddleware: Forbidden access attempt from {remote_addr}")
                return HttpResponseForbidden("The maze wasn't meant for you.")