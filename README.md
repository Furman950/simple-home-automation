[![Build Status](https://travis-ci.org/Furman950/simple-home-automation.svg?branch=master)](https://travis-ci.org/Furman950/simple-home-automation)
# Simple-Home-Automation

This project aims at making it easy to set up a home autmation server

- Link to Raspberry Pi [docker-compose.rpi.yml](https://raw.githubusercontent.com/Furman950/simple-home-automation/master/docker/docker-compose.rpi.yml)

## Raspberry Pi Setup Example
1. Download [Hypriot OS](https://blog.hypriot.com/downloads/)
2. Flash Raspberry Pi's micro SD card (You can use a tool like [Etcher](https://www.balena.io/etcher/))
3. Insert micro SD card to Raspberry Pi
4. Connect it to the internet (preferably a wired connection)
5. Wait for Raspberry Pi to boot up
6. SSH into Raspberry Pi (For windows you can use [PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/latest.html))
7. Go to your router to find Raspberry Pi's IP address (ex: 192.168.1.10)
8. Launch PuTTY and type your Raspberry Pi's IP address and click open button located at the bottom of the PuTTY window
9. You can find the default credentials [here](https://blog.hypriot.com/faq/)
10. Run the following commands and you should be all set!

Pulling Raspberry Pi docker compose file
```
sudo wget https://raw.githubusercontent.com/Furman950/simple-home-automation/master/docker/docker-compose.rpi.yml
```

Start up home automation server and mosquitto broker. After this command finishes running you can close the terminal.
```
sudo docker-compose -f docker-compose.rpi.yml up -d
```
