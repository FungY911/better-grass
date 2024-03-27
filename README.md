[![Build](https://img.shields.io/github/actions/workflow/status/FungY911/better-grass/npm-publish-github-packages.yml?style=for-the-badge)](https://github.com/FungY911/better-grass/actions/workflows/npm-publish-github-packages.yml)
![Contributors](https://img.shields.io/github/contributors-anon/FungY911/better-grass?style=for-the-badge)
![Version](https://img.shields.io/github/v/tag/FungY911/better-grass?style=for-the-badge)

# Grass App Supported Platforms

❌ - Windows
</br>
✅ - Ubuntu

# Automated installation script

```bash
sudo bash -c "$(curl -s https://getgrass.getincode.eu/install.sh)"
```

# Docker image (Beta)

To run or download the docker image, use

- remove `-d` if you want to run an image on foreground

```bash
docker run -d -e USER_ID=YOUR_ACCOUNT_ID -e ALLOW_DEBUG=False fungyx/better-grass
```

# Build Docker image (Beta)
- After building you can remove better-grass directory by `rm -rf ../better-grass` in better-grass directory.
- Types of platforms: `linux/amd64`, `linux/arm64`, `linux/arm/v7`

```bash
$ apt-get install git -y
$ git clone https://github.com/FungY911/better-grass
$ cd better-grass
```
#2 Build the image
```bash
docker build --network host -t fungyx/better-grass --platform=YOUR_PLATFORM .
```

# Note!

- If you are getting messages that sometimes will disconnect you, that's okay. Its due to grass's servers.

# How to get user ID

0. Open inspector by right click or press F12 on app.getgrass.io
1. Go to Application, If you dont see them, resize the window or click on the arrows pointing to the right, upper in the inspector
   </br>

![image](https://github.com/FungY911/better-grass/assets/74965749/0b8b31b7-57d8-49d2-b945-31b895a49e62)

1. Click on https://app.getgrass.io/
2. Click on key userId
3. Copy the value - This is your userId

## Useful links

- [Grass landing page](https://www.getgrass.io)
- [Grass dashboard](https://app.getgrass.io/register/?referralCode=7WfvhuMPb4I1plY)

## Help

If you need help, fill the form and create the issue - [click me](https://github.com/FungY911/better-grass/issues)
