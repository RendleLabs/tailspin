# tailspin

In-browser aggregation of local docker logs

Just a thrown-together thing for viewing output of `docker logs -f {container}` across all running containers
with an easy HTML UI.

We wrote it because we're running [docker-compose](https://docs.docker.com/compose/) with upwards of half-a-dozen containers,
and keeping an eye on them all via the CLI is painful.

## Instructions

```
npm install
bower install
gulp serve
```

## TODO

* Auto-scroll to the bottom of each log when it changes
* Show indicator on container pill when new log text is appended
