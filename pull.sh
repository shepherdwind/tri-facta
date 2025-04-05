#!/bin/bash

# 从 package.json 读取版本号
VERSION=$(node -p "require('./package.json').version")

# 设置镜像名称
IMAGE_NAME="ghcr.io/shepherdwind/tri-facta"

# 拉取指定版本的镜像
echo "Pulling Docker image (version: $VERSION)..."
docker pull $IMAGE_NAME:$VERSION

# 检查拉取是否成功
if [ $? -eq 0 ]; then
    echo "Pull successful!"
    echo "Image: $IMAGE_NAME:$VERSION"
else
    echo "Pull failed!"
    exit 1
fi 