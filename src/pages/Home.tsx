import style from './home.module.scss';
import NewPost from '../components/newPost/NewPost';
import Header from '../components/common/Header';
import LoadingCard from '../components/common/LoadingCard';
import LoadError from '../components/common/LoadError';
import InfiniteScroll from 'react-infinite-scroll-component';
import Post from '../components/posts/Post';
import useHomeQL from '../hooks/graphQL/useHomeQL';

const Home: React.FC = () => {
  const { loading, error, fetchMoreData, notes, homeNext } = useHomeQL();

  return (
    <main className={`${style['main']}`}>
      <Header title='首页' />
      <NewPost />
      {error ? (
        <LoadError />
      ) : loading ? (
        <LoadingCard loading />
      ) : notes ? (
        <InfiniteScroll
          dataLength={notes.length}
          next={fetchMoreData}
          hasMore={homeNext}
          loader={<LoadingCard loading />}
        >
          {notes.map((item) => (
            <Post key={item.id} {...item} />
          ))}
        </InfiniteScroll>
      ) : (
        <LoadError />
      )}
    </main>
  );
};

export default Home;
