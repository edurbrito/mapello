FROM ubuntu:latest

COPY . /home/

WORKDIR /home/

ENV PATH "$PATH:/home/sicstus/bin"

CMD ["sicstus", "-l", "server.pl", "--goal","server."]