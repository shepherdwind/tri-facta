#!/bin/bash

# 设置版本号（可以从环境变量获取，默认为 latest）
VERSION=${1:-latest}

# 构建镜像
echo "Building Docker image..."
docker build -t shepherdwind/tri-facta:$VERSION .

# 检查构建是否成功
if [ $? -eq 0 ]; then
    echo "Build successful!"
    
    # 推送镜像到 Docker Hub
    echo "Pushing image to Docker Hub..."
    docker push shepherdwind/tri-facta:$VERSION
    
    if [ $? -eq 0 ]; then
        echo "Push successful!"
        echo "Image: shepherdwind/tri-facta:$VERSION"
    else
        echo "Push failed!"
        exit 1
    fi
else
    echo "Build failed!"
    exit 1
fi 