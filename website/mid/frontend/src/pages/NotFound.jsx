import { Link } from "react-router-dom";
import Title from "../components/Title";

const NotFound = () => {
  return (
    <div className="text-center py-24 border-t hairline-gold min-h-[50vh]">
      <div className="text-2xl sm:text-3xl mb-4">
        <Title text1={"404"} text2={"NOT FOUND"} />
      </div>
      <p className="text-ivory-400 max-w-md mx-auto px-4">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="btn-gold mt-8"
      >
        Back to home
      </Link>
    </div>
  );
};

export default NotFound;
