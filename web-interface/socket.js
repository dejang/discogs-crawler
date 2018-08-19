const ws = new WebSocket(`ws://${window.location.host}/echo`);
export default ws;