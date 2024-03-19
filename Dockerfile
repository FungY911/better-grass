FROM alpine:3.19

RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN apk add --no-cache chromium chromium-chromedriver unzip curl
RUN apk add --update --no-cache py3-pip
RUN apk add --no-cache xauth

WORKDIR /usr/src/app
COPY app .
RUN pip install --no-cache-dir -r ./requirements.txt --break-system-packages

CMD [ "python", "./main.py" ]