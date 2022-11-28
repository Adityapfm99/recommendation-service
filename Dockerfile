ARG account=latest
FROM ${account}.dkr.ecr.ap-southeast-1.amazonaws.com/node:18.4.0

WORKDIR /app
COPY dist .
CMD ["npm","run","start:prod"]

EXPOSE 4000
