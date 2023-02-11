import { createResource } from "solid-js";

async function getCwd() {
  return Gluon.ipc.cwd();
}

function App() {
  const [cwd] = createResource(getCwd);

  return <div>{cwd()}</div>;
}

export default App;
