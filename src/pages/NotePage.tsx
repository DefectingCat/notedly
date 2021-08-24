import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { Avatar, Card, Spin } from 'antd';
import style from './notepage.module.scss';
import LoadingCard from '../components/common/LoadingCard';
import LoadError from '../components/common/LoadError';
import Header from '../components/common/Header';
import { useHistory } from 'react-router';
import IconFont from '../components/common/icon/NotedlyIcons';
import { lazy, Suspense, useState } from 'react';
import parseTime from '../hooks/util/parseTime';
import ReactMarkdown from 'react-markdown';
import MoreAction from '../components/common/MoreAction';

const { Meta } = Card;

/**
 * Comment 组件需要手动打开
 * 对其进行异步懒加载
 */
const CommentList = lazy(() => import('../components/comment/CommentList'));

interface Params {
  id: string;
}

interface Note {
  note: NoteClass;
}

interface NoteClass {
  id: string;
  createdAt: string;
  content: string;
  author: Author;
}

interface Author {
  id: string;
  avatar: string;
  email: string;
  username: string;
}

const GET_NOTE = gql`
  query Note($id: ID!) {
    note(id: $id) {
      id
      createdAt
      content
      author {
        id
        avatar
        email
        username
      }
    }
  }
`;

const NotePage: React.FC = () => {
  // 当前 post id ，由父组件传递
  const { id } = useParams<Params>();

  // 是否显示评论框
  const [showComment, setShowComment] = useState(false);

  const { data, loading, error } = useQuery<Note, Params>(GET_NOTE, {
    variables: { id },
  });

  const history = useHistory();

  /**
   * 传递给 Header 的返回回调函数
   */
  const onBack = () => {
    history.go(-1);
  };

  const openComment = () => {
    setShowComment(!showComment);
  };

  if (error) return <LoadError />;

  if (loading)
    return (
      <>
        <Header title='详情' backable />
        <LoadingCard loading />
      </>
    );

  if (data) {
    const { createdAt, content, author } = data.note;

    return (
      <>
        <Header title='详情' backable onBack={onBack} />
        <Card
          className={style['post-card']}
          actions={[
            <IconFont type='icon-comment' onClick={openComment} />,
            <MoreAction postId={id} userId={author.id} />,
          ]}
        >
          <Meta
            avatar={<Avatar src={author.avatar} />}
            title={`@${author.username}`}
            description={parseTime(createdAt)}
          />
          <div className={`${style['post-card-body']} markdown-body`}>
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </Card>

        <Suspense
          fallback={
            <div className={style.loading}>
              <Spin />
            </div>
          }
        >
          {showComment ? <CommentList id={id} /> : void 0}
        </Suspense>
      </>
    );
  }

  return <LoadError />;
};

export default NotePage;
