# Use an official Node.js runtime as the base image
FROM node:18.13.0

# Set the working directory in the container
WORKDIR /Users/shahab/Documents/Dev/NodeJs/Express/Chat Application/MyChatApp

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the remaining application files to the working directory
COPY . .

# Expose the port on which your Node.js application listens
EXPOSE 3000

# Start the Node.js application
CMD [ "npm", "start" ]
