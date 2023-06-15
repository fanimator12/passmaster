FROM python:3.10.6

WORKDIR /app

COPY . /app

RUN pip install --no-cache-dir --upgrade -r requirements.txt

ENV BACKEND_VARIABLE='passmaster-backend'

CMD uvicorn main:app --port=8000 --host=0.0.0.0