# serverless-framework

## Script to create a layer with serverless
#!/bin/bash
npm i --omit=dev
mkdir nodejs/
mv node_modules/ nodejs/
zip -r nodejs-layer.zip nodejs/
rm -rf nodejs/

# Script to create a layer with aws client
#!/bin/bash
aws lambda publish-layer-version --layer-name my-first-layer \
--description "My first layer for lambda with nodejs" \
--license-info "MIT" \
--zip-file fileb://nodejs-layer.zip \
--compatible-runtimes nodejs18.x \
--compatible-architectures x86_64 \