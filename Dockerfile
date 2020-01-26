FROM python:3.7
ENV PYTHONUNBUFFERED 1

COPY . ./chat
WORKDIR /chat
COPY ./container/local_settings.template /chat/chatapp/local_settings.py

RUN pip install -r requirements/base.txt
