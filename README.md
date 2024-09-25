# Lottery

基于 WebSocket 的在线发号 & 摇号抽奖 Web App

## Preview

[lott.mofu.app](https://lott.mofu.app)（此部署限制单 Lobby 最多 2000 人在线）

<p align="center">
  <img src="docs/home.webp" width="50%">
  <img src="docs/screen.webp" width="50%">
</p>

## Deploy

```sh
docker compose build
docker compose up
```

然后访问 `http://localhost:3080`

也可以创建 `compose.override.yml` 来重写 Docker Compose 配置

## Development

```sh
pnpm i
pnpm dev:backend
pnpm dev:web
```
