FROM python:3.8

RUN apt-get update \ 
  && apt-get install -y iputils-ping

WORKDIR /app

COPY ./ ./

RUN pip install pywizlight paho-mqtt

CMD ["python", "./main.py"]

# ENTRYPOINT ["tail"]
# CMD ["-f","/dev/null"]
