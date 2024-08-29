import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="p-4 bg-gray-800 text-white">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-lg font-bold">
          Home
        </Link>
        <Link to="/create" className="text-lg">
          Create Project
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
