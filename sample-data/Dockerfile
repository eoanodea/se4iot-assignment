FROM python:3.8

RUN apt-get update \ 
  && apt-get install -y iputils-ping

WORKDIR /app

RUN pip install influxdb-client

CMD ["python", "./main.py"]

# Comment this out to generate sample data
ENTRYPOINT ["tail"]
CMD ["-f","/dev/null"]
