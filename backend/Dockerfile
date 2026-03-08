FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm ci --only=production

# Bundle app source
COPY . .

# We don't expose 3000 hardcoded as Render will dynamically inject PORT.
# But it's good practice to document it if testing locally.
EXPOSE 10000

# Start the server
CMD [ "node", "server.js" ]
