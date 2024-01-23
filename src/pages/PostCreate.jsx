import { Navigate, useParams } from 'react-router-dom';
import { useAuthContext } from '../providers/AuthProvider';

export const PostCreate = () => {
  const { profile } = useAuthContext();
  const { blogId } = useParams();

  // this is not the cleanest way to handle "authentication routing" but works for now
  if (!profile) {
    return <Navigate to={'/login'} />;
  }

  if (!blogId) {
    console.warn('blogId is not defined');
    return <Navigate to={'/blogs'} />;
  }

  return (
    <div>
      <h1>Create Post for Blog ID {blogId}</h1>
      In this component, have an HTML form that takes in the blog post
      information, stores it in a state variable (or multiple if needed).
      
      If you are also submitting a file, have it call a function to
      send to Storage, then call `getDownloadURL()` on the new Storage object to
      get the URL, and then put that URL value with the rest of the Post data
      into a Firestore document.
    </div>
  );
};
