FROM nginx:alpine

# 复制前端构建产物
# COPY dist/ /usr/share/nginx/html/

# 覆盖默认 nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf

# 可选:暴露 80 端口(默认已暴露)
EXPOSE 80