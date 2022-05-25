FROM node:14.10.1

# Define the working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the source code
COPY . .

# Define the entry executable
CMD ["npm", "run", "start"]