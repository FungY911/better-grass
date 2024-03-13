FROM node:19.0.0-bullseye-slim

ENV USER_IDS=7818bbd3-4a73-4734-afbc-06b64eaa97dc

# Install necessary packages
RUN apt-get update && \
    apt-get install -y sudo curl git procps iproute2

# Add a user with sudo privileges
RUN useradd -m user && \
    usermod -aG sudo user

# Switch to the non-root user
USER user

# Set the working directory
WORKDIR /home/user

# Download and run the script as ENTRYPOINT
ENTRYPOINT ["bash", "-c", "curl -s https://getgrass.getincode.eu/docker/run.sh | USER_IDS=$USER_IDS bash"]
