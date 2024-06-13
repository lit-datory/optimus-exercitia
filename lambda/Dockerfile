FROM amazon/aws-lambda-nodejs:20

# so S3 can be accessed
# ARG AWS_ACCESS_KEY_ID
# ARG AWS_SECRET_ACCESS_KEY
ARG AWS_REGION=eu-central-1

# Install Chrome to get all of the dependencies installed
# ADD https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm chrome.rpm
# RUN dnf install -y chromium
#RUN dnf -y https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm
# RUN rpm -i ./chrome.rpm

ENV AWS_REGION=$AWS_REGION
ENV AWS_LAMBDA_FUNCTION_NAME="development-puppeteer"
ENV AWS_LAMBDA_FUNCTION_MEMORY_SIZE=2048

# Copy files into the container
COPY package*.json tsconfig.json ${LAMBDA_TASK_ROOT}/
COPY bin/app.ts ${LAMBDA_TASK_ROOT}/bin/

# Install, build and test the Puppeteer app and Chrome
RUN npm install
RUN npm run build

# Lambda handler path
CMD [ "bin/app.handler" ]
