# WLED Manager

Application for managing [WLED](https://kno.wled.ge/) devices.

## 🛫 Quick Setup

[![Required Node.JS >= 14.18.0 || >=16.0.0](https://img.shields.io/static/v1?label=node&message=14.18.0%20||%20%3E=16.0.0&logo=node.js&color=3f893e)](https://nodejs.org/about/releases)

- I'm using pnpm, but npm should work fine.

```sh
# clone the project
git clone https://github.com/robhybrid/wled-manager.git

# enter the project directory
cd wled-manager

# install dependency
pnpm install

# develop
pnpm dev
```

based on [electron-vite-react](https://github.com/electron-vite/electron-vite-react)

## Features / road-map

[x] Find WLED devices, both on and off network
[x] One-click connect devices to wifi network
[ ] Automated back-up / download /restore and install WLED and compatible binaries
[ ] Manage LED configurations
[ ] View and manage sync settings and conflicts for the entire network
