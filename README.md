# netgear-r7000-rebooter

Simple app to schedule the rebooting of the Netgear R7000 router on a daily basis.

### Config:

Make a `.env` file from the example file: `.env.example` and complete the required parameters:

```
SCHEDULED_DAILY_REBOOT_TIME= [[ time for daily reboot in hh:mm 24h format ]]
ADMIN_WEB_URL=http://routerlogin.net
USERNAME=[[ your router admin username ]]
PASSWORD=[[ your router admin password ]]
```

### Run:

```
npm start
```
