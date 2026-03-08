FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy the backend code into the container
COPY backend/package*.json ./backend/

# Install app dependencies
RUN cd backend && npm ci --only=production

# Bundle app source
COPY backend/ ./backend/

EXPOSE 10000

# Start the server
CMD [ "node", "backend/server.js" ]
