FROM node:16

# Create app directory
WORKDIR /app

COPY package*.json ./

# Install
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

CMD [ "npm", "start" ]
# ENTRYPOINT ["tail"]
# CMD ["-f","/dev/null"]