var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var child_process_1 = require("child_process");
var events_1 = require("events");
var _ = require("lodash");
var DockerLogs = (function (_super) {
    __extends(DockerLogs, _super);
    function DockerLogs() {
        var _this = this;
        _super.call(this);
        this._procs = [];
        child_process_1.exec("docker ps -q", function (err, stdout) {
            if (err)
                return;
            var ids = _.filter(stdout.split("\n"), function (s) { return !!s; });
            ids.forEach(function (id) {
                child_process_1.exec("docker inspect " + id, function (err, json) {
                    if (err)
                        return;
                    var info = JSON.parse(json.toString("utf8"))[0];
                    if (info.Name) {
                        var container = info.Name.substr(1);
                        var proc = child_process_1.spawn("docker", ["logs", "-f", container]);
                        proc.stdout.on("data", function (data) { return _this.emit("stdout", { container: container, text: data.toString("utf8") }); });
                        proc.stderr.on("data", function (data) { return _this.emit("stderr", { container: container, text: data.toString("utf8") }); });
                        _this._procs.push(proc);
                    }
                });
            });
        });
    }
    return DockerLogs;
})(events_1.EventEmitter);
exports.DockerLogs = DockerLogs;
