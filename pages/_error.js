import { useRouter } from 'next/router';
import { useMobile } from '../components/providers/MobileContext';

const ErrorPage = () => {
  const router = useRouter();
  const {isMobile} = useMobile();
  const { error } = router.query;

  return (
    <div id="error-page page" style={{ marginTop: '192px'}}>
      <div style={{transform: isMobile?'none':'translateX(-50%)' }}>
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