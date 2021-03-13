FROM node:alpine as builder
WORKDIR /app
COPY ./frontend/package*.json ./
RUN npm install
COPY ./frontend/ .
RUN npm run build


FROM python:3.9-alpine

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apk update \
    && apk add --virtual build-deps gcc python3-dev musl-dev \
    && apk add jpeg-dev zlib-dev \
    && apk add postgresql-dev 

RUN pip install --upgrade pip \
    && pip install pipenv

COPY ./Pipfile /app/Pipfile

RUN pipenv install --skip-lock --system

RUN apk del build-deps

COPY . .
COPY --from=builder /app/build /app/frontend/build

ENTRYPOINT [ "/app/entrypoint.prod.sh" ]