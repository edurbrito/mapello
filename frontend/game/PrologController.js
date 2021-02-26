/**
* PrologController class, responsible for sending requests to the Prolog Server.
*/
class PrologController {

    constructor(port = 8081) {
        this.port = port;
        this.request = undefined;
    }

    /**
     * Sends a GET request to the Prolog Server
     * Request is of the form pred-args, args being a list of arguments for the predicate to be called
     */
    send(pred, args, onSuccess, onError, asyncr = true, timeout = 3000, onTimeout) {
        let request = new XMLHttpRequest();
        request.open(
            "GET",
            "http://localhost:" + this.port + "/" + pred + "-" + args,
            asyncr
        );

        request.onload =
            onSuccess ||
            function (data) {
                // console.log("Request successful. Reply: ", JSON.parse(data.target.response));
                request.result = JSON.parse(data.target.response);
            };

        request.onerror =
            onError ||
            function () {
                console.log("Error waiting for response");
            };

        if (asyncr)
            request.timeout = timeout;

        request.ontimeout =
            onTimeout ||
            function () {
                console.log("Timeout for response. Sending again");
                request.send();
            };

        request.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded; charset=UTF-8"
        );

        request.send();
        this.request = request;

        return request;
    }

    getRequest() {
        return this.request;
    }

    getResult() {
        return this.request.result;
    }
}