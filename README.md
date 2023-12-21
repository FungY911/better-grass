# Grass VPS App

Grass app that can be ran on VPS machines. It can detect all network interfaces automatically.

# Note!

- If you are getting messages that sometimes will disconnect you, that's okay.
- If in your dashboard does not saying online, everything works. If you feel that not, try to contact me via issues.

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
# How to get user ID
0. Open inspector by right click or press F12 on app.getgrass.io
0. Go to Application, If you dont see them, resize the window or click on the arrows pointing to the right, upper in the inspector
</ br>

![image](https://github.com/FungY911/better-grass/assets/74965749/0b8b31b7-57d8-49d2-b945-31b895a49e62)
1. Click on https://app.getgrass.io/
2. Click on key userId
3. Copy the value - This is your userId

## Useful links

- [Grass landing page](https://www.getgrass.io)
- [Grass dashboard](https://app.getgrass.io/register/?referralCode=7WfvhuMPb4I1plY)

## Help
If you need help, fill the form and create the issue - [click me](https://github.com/FungY911/better-grass/issues)
