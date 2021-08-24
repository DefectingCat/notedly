import Header from '../components/common/Header';
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadError from '../components/common/LoadError';
import LoadingCard from '../components/common/LoadingCard';
import style from '../pages/home.module.scss';
import Post from '../components/posts/Post';
import useProfileQL from '../hooks/graphQL/useProfileQL';

const MyNote: React.FC = () => {
  const { error, loading, myNotes, fetchMoreData, myNext } = useProfileQL();

  return (
    <>
      <main className={`${style['main']}`}>
        <Header title='我的动态' />
        {error ? (
          <LoadError />
        ) : loading ? (
          <LoadingCard loading />
        ) : myNotes ? (
          <InfiniteScroll
            dataLength={myNotes.length}
            next={fetchMoreData}
            hasMore={myNext}
            loader={<LoadingCard loading />}
          >
            {myNotes.map((item) => (
              <Post key={item.id} {...item} />
            ))}
          </InfiniteScroll>
        ) : (
          <LoadError />
        )}
      </main>
    </>
  );
};

export default MyNote;
