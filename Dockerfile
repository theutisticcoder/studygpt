# Use the official Node.js image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /

# Copy the application files into the working directory

# Install the application dependencies
RUN npm install

# Define the entry point for the container
RUN nohup node index.js &
