import {exec, spawn, ChildProcess} from "child_process";
import {EventEmitter} from "events";
import * as async from "async";
import * as _ from "lodash";

export class DockerLogs extends EventEmitter {
    private _procs: ChildProcess[] = [];

    constructor() {
        super();
        exec("docker ps -q", (err, stdout: string) => {
            if (err) return;
            var ids = _.filter(stdout.split("\n"), s => !!s);
            ids.forEach((id) => {
                exec("docker inspect " + id, (err, json) => {
                    if (err) return;
                    var info = JSON.parse(json.toString("utf8"))[0];
                    if (info.Name) {
                        var container = info.Name.substr(1);
                        var proc = spawn("docker", ["logs", "-f", container]);
                        (<NodeJS.EventEmitter>proc.stdout).on("data",
                            (data) => this.emit("stdout", {container: container, text: data.toString("utf8")}));
                        (<NodeJS.EventEmitter>proc.stderr).on("data",
                            (data) => this.emit("stderr", {container: container, text: data.toString("utf8")}));
                        this._procs.push(proc);
                    }
                });
            });
        });
    }
}

