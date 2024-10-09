FROM alpine:3.20.3

RUN apk update && \
	apk add --no-cache openssl

COPY tools/certs-generator.sh /tmp/certs-generator.sh

RUN chmod +x /tmp/certs-generator.sh

CMD ["/tmp/certs-generator.sh"]
