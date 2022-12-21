FROM python:3.8

LABEL Name="Python Bulb Controller"

WORKDIR /app

COPY ./ ./

RUN pip install pywizlight paho-mqtt

CMD ["python", "./main.py"]
