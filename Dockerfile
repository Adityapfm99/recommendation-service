ARG account=latest
FROM ${account}.dkr.ecr.ap-southeast-1.amazonaws.com/node:18.4.0

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD ["npm","run","start"]

EXPOSE 4000
