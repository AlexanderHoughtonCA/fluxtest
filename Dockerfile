FROM ubuntu:22.04

ENV TZ=America/Vancouver
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

EXPOSE 5433
EXPOSE 5434

# Redis default port
EXPOSE 6379

# Ubuntu updates
RUN apt-get -y update
ENV DEBIAN_FRONTEND=noninteractive

# Install Redis
RUN apt-get install -y redis-server

# Configure Redis to run as a background service
RUN sed -i 's/^supervised no/supervised systemd/' /etc/redis/redis.conf

# Create app folder
RUN mkdir -p /app
WORKDIR /app

# NVM, Node, npm
ENV NODE_VERSION=18.20.7
RUN apt-get install -y curl
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
RUN node --version
RUN npm --version

# RUN apt-get install -y postgresql postgresql-contrib

#RUN apt-get install -y iputils-ping dnsutils  netcat
# RUN apt-get -y update && apt-get install -y default-mysql-client default-libmysqlclient-dev

COPY ./package.json ./
RUN npm install
COPY . .

CMD ["node", "./index.js"]
