import { useOutletContext } from "react-router-dom";
import AuthorDashboardAfter from "./AuthorDashboardAfter";
import HomePage from "./AuthorHomePage";


const AuthorIndexPage = () => {
  const { hasBooks } = useOutletContext();

  if (hasBooks === null) return <p>Loading...</p>;

  return hasBooks ? <AuthorDashboardAfter /> : <HomePage />;
};

export default AuthorIndexPage;
