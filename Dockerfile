# Use an official Nginx image as a parent image
FROM nginx:alpine

# Copy the static files to the Nginx web directory
COPY . /usr/share/nginx/html

# Expose the port that Nginx runs on
EXPOSE 80