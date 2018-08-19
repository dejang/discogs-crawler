const ws = new WebSocket(`ws://${window.location.host}:${window.location.port}/echo`);
export default ws;