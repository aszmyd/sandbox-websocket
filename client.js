((root) => {
    let wsConnection;
    let keepAliveCounter = 0;
    const host = '192.168.50.14:8080';

    const connectWebSocket = () => {

        const sendKeepAlive = () => {
            keepAliveCounter++;
            wsConnection.send(JSON.stringify({
                type: 'client_alive',
                count: keepAliveCounter
            }))
        };

        wsConnection = new WebSocket(`ws://${host}/`, 'echo-protocol');
        console.log('Connecting...');
        wsConnection.addEventListener('open', () => {
            console.log('WebSocket opened');
            console.log('test');
            setInterval(() => {
                sendKeepAlive();
            }, 1000);
        });
        wsConnection.addEventListener('close', (e) => {
            console.log('WebSocket closed!!!');
            console.log(e);
        });
        wsConnection.addEventListener('error', () => {
            console.error('WebSocket error!!!');
        });
        wsConnection.addEventListener('message', (event) => {
            console.log(`Received: ${event.data}`)
        });
    };

    const startRestTest = () => {

        const sendRequest = () => {
            keepAliveCounter++;
            console.log('SEND ' + keepAliveCounter);
            fetch(`http://${host}/rest`);
        };

        setInterval(() => {
            sendRequest();
        }, 1000)
    };

    root.connectWebSocket = connectWebSocket;
    root.startRestTest = startRestTest;


})(window);