((root) => {
    const logs = document.getElementById('logs');
    let wsConnection;
    let keepAliveCounter = 0;

    const addLog = (message) => {
        logs.innerText = logs.innerText + '\n' + message
    };

    const connect = () => {
        wsConnection = new WebSocket('ws://localhost:8080/', 'echo-protocol');
        addLog('Connecting...');
        wsConnection.addEventListener('open', () => {
            addLog('WebSocket opened');
            setInterval(() => {
                sendKeepAlive();
            }, 1000);
        });
        wsConnection.addEventListener('close', () => {
            addLog('WebSocket closed!!!');
        });
        wsConnection.addEventListener('error', () => {
            addLog('WebSocket error!!!');
        });
        wsConnection.addEventListener('message', (event) => {
            addLog(`Received: ${event.data}`)
        });
    };

    const sendKeepAlive = () => {
        keepAliveCounter++;
        wsConnection.send(JSON.stringify({
            type: 'client_alive',
            count: keepAliveCounter
        }))
    };

    root.connect = connect;


})(window);