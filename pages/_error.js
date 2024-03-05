import { useRouter } from 'next/router';
import Header from '../components/Header';

const ErrorPage = () => {
  const router = useRouter();
  const { error } = router.query;

  return (
    <div id="error-page page" style={{ marginTop: '192px'}}>
      <Header />
      <div style={{transform: 'translateX(-50%)' }}>
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error?.statusText || error?.message}</i>
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;