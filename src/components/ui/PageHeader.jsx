import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './PageHeader.css';

const PageHeader = ({ title }) => {
  const navigate = useNavigate();

  return (
    <header className="page-header">
      <button onClick={() => navigate(-1)} className="back-btn">
        <ArrowBackIcon />
      </button>
      <h1>{title}</h1>
    </header>
  );
};

export default PageHeader;
