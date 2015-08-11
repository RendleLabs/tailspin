declare module ansi_up {
    function ansi_to_html(text: string, options?: any): string;
}
namespace Tailspin {

    interface LogOutput {
        container: string;
        text: string;
    }

    var containers = {};

    function ensureContainer(container: string) {
        var pane;
        if (pane = containers[container]) return pane;
        var tab = '<li role="presentation"><a href="#' + container + '" data-toggle="pill">' + container + '</a></li>';
        pane = $('<div class="tab-pane log-text" id="' + container + '">');
        containers[container] = pane;
        $("#tabs").append(tab);
        $("#panes").append(pane);
        return pane;
    }

    function format(text: string) {
        return ansi_up.ansi_to_html(text).replace(/\n/g, "<br>") + "<br>";
    }

    $(() => {
        var socket = io.connect("http://localhost:3000");
        socket.on("stdout", (log: LogOutput) => {
            var pane = ensureContainer(log.container);
            pane.append(ansi_up.ansi_to_html(format(log.text)));
        });
        socket.on("stderr", (log: LogOutput) => {
            var pane = ensureContainer(log.container);
            pane.append(ansi_up.ansi_to_html(format(log.text)));
        });
    });

}
