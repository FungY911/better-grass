# Grass VPS App

Grass app that can be ran on VPS machines. It can detect all network interfaces automatically.

## Before you start

#### 1. Check if you have some of the dependencies already

This app is a NodeJS app and some linux OS already have it and you can check the version of it by running the `node -v` command, if something is returned, this means you already have it. But this app requires `v19.0.0` so you might need to update it. Here's a helpful link: [3 Ways to Update Node.js to Latest Version on Linux Systems
](https://phoenixnap.com/kb/update-node-js-version).

#### 2. Check if your network interfaces have unique labels

Linux systems have labels for IP addresses and you can check that by using the `ip address show` command on your terminal. If you see that the results of the command has the same name for your IP address range (example: if your IPs from `192.168.0.1/255` have the same `eth0` label), you'll have to modify each network interface to have a different label (example: the `192.168.0.1` IP has `eth0:0` and `192.168.0.2` has `eth:1` and so on). We have created a script that does that for you. Simply run the `modify-network-interface.sh` file on your terminal and check your addresses by running `ip address show` again.

## Running the app

1. Clone the github repository to your VPS machine.
2. Run the `/scripts/start.sh` file which will install the necessary packages and dependencies to run the app locally. **NOTE: This will ask for your user id/s as input so that the grass knows who owns these IP addresses.**
3. It should now run the app. Check your dashboard app to see if the IP addresses are starting to reflect.

If you ever experience issues, please [join our discord](https://discord.gg/vtM9963QT8) and open a ticket.

## Useful links

- [Grass landing page](https://www.getgrass.io)
- [Grass dashboard](https://app.getgrass.io/register/?referralCode=7WfvhuMPb4I1plY)
