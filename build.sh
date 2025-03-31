#!/bin/bash

# 从 package.json 读取版本号
VERSION=$(node -p "require('./package.json').version")

# 创建并使用多平台构建器
echo "Setting up multi-platform builder..."
docker buildx create --name multiarch-builder --use || true

# 构建多平台镜像
echo "Building multi-platform Docker image (version: $VERSION)..."
docker buildx build \
  --platform linux/amd64 \
  -t shepherdwind/tri-facta:$VERSION \
  -t shepherdwind/tri-facta:latest \
  --push \
  .

# 检查构建是否成功
if [ $? -eq 0 ]; then
    echo "Build successful!"
    echo "Images:"
    echo "  - shepherdwind/tri-facta:$VERSION"
    echo "  - shepherdwind/tri-facta:latest"
else
    echo "Build failed!"
    exit 1
fi 