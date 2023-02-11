import { createResource } from "solid-js";

async function scanDeps() {
  return Gluon.ipc.scanDeps();
}

function App() {
  const [data] = createResource(scanDeps);

  return <div>{data()}</div>;
}

export default App;
