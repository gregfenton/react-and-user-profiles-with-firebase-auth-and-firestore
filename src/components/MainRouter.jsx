import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Login } from '../pages/Login';
import { RestOfTheApp } from '../pages/RestOfTheApp';
import { BlogList } from '../pages/BlogList';
import { PostList } from '../pages/PostList';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RestOfTheApp />
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/blogs',
    element: <BlogList />
  },
  {
    path: '/posts/:blogId',
    element: <PostList />
  },
  {
    path: '/posts/:blogId/create',
    element: <h1>Create new post in blogId here</h1>
  }
]);

export const MainRouter = () => {
  return <RouterProvider router={router} />;
};

export default MainRouter;
