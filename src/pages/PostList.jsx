import { Navigate, useParams } from 'react-router-dom';
import { useAuthContext } from '../providers/AuthProvider';

export const PostList = () => {
  const { profile } = useAuthContext();
  const { blogId } = useParams();

  // this is not the cleanest way to handle "authentication routing" but works for now
  if (!profile) {
    console.warn('profile is not defined. Redirecting to /login.');
    return <Navigate to={'/login'} />;
  }

  if (!blogId) {
    console.warn('blogId is not defined');
    return <Navigate to={'/blogs'} />;
  }

  return (
    <div>
      <h1>Posts for blog {blogId}</h1>
      In this component, add code to fetch the posts for the <em>
        blogId
      </em>{' '}
      from the Firestore API and display them here. You will use a `useEffect`
      to asynchronously fetch the data, put it into a state variable
      (`useState`) and then display the values in that state variable here using
      `.map()`
    </div>
  );
};
