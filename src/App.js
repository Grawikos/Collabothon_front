function App() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "Backend URL not set\n use {oc set env dc/react-frontend REACT_APP_BACKEND_URL='http://my-backend-route-url.com'}";

  return (
    <div style={{ padding: "30px", fontSize: "20px" }}>
      <h2>React App Running on OpenShift</h2>
      <p>Backend API URL: <strong>{backendUrl}</strong></p>
    </div>
  );
}

export default App;