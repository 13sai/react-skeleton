import { Link } from 'react-router-dom';
import { Result, Button } from 'antd';

function NotFound(){
  return (
    <Result
      status='404'
      title='404'
      subTitle='Sorry, the page not found.'
      extra={
        <Link to='/'>
          <Button type='primary'>Back Home</Button>
        </Link>
      }
    />
  );
}

export default NotFound;
