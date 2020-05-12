# Netgear-R7000-Rebooter

Simple app to reboot the Netgear R7000 router on a scheduled daily basis.

---

### Config:

Make a `.env` file from the example file: `.env.example` and complete the required parameters:

```
SCHEDULED_DAILY_REBOOT_TIME= [[ time for daily reboot in hh:mm 24h format ]]
ADMIN_WEB_URL=http://routerlogin.net
USERNAME=[[ your router admin username ]]
PASSWORD=[[ your router admin password ]]
```

---

### Running:

#### As service:

I recommend running as a service. I opted to use `pm2` - <https://pm2.keymetrics.io/>

```
npm install -g pm2
```

Then to start the service:

```
npm run service-start
```

and to stop:

```
npm run service-stop
```

#### Logs:

Running in service mode will send all console logs to a file `logfile.txt`.

##

#### Single run:

```
npm start
```

#### Single run debug:

Runs the script but will 'dismiss' on the confirmation reboot dialog.

```
npm start --debug
```
