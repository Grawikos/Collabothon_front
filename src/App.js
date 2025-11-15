function App() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "Backend URL not set, use \n\
oc set env deploy/react-frontend REACT_APP_BACKEND_URL='http://my-backend-route-url.com'\n\
oc start-build bc/react-frontend --follow";

  return (
    <div style={{ padding: "30px", fontSize: "20px" }}>
      <h2>React App Running on OpenShift version 2</h2>
      <p>Backend API URL: <strong>{backendUrl}</strong></p>
      <p>TEST WEBHOOK3</p>
    </div>
  );
}

export default App;