# Step 1: Use official Node image for building React
FROM node:20 AS build
WORKDIR /app

# Step 2: Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Step 3: Install dependencies
RUN npm install

# Step 4: Copy all source code
COPY . ./

# Step 5: Build React app (production-ready)
RUN npm run build

# Step 6: Use Nginx to serve the built React app
FROM nginx:alpine
# Copy build output to Nginx folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Nginx runs by default
