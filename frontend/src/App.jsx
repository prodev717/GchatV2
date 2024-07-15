import { BrowserRouter,Routes,Route,Navigate } from "react-router-dom";
import Home from "./Home";
import Web from "./Web";

function App() {
    return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/web" element={<Web />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
