import CreateProjectForm from "./components/CreateProjectForm";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProjectsPage from "./components/ProjectsPage";
const App = () => {
  return(
    <Router>
    <div>
      <Navbar/>
      <Routes>
        <Route path="/" element={<ProjectsPage/>} />
        <Route path="/create" element={<CreateProjectForm />} />
      </Routes>
    </div>
  </Router>
    
  );
}

export default App;