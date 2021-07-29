import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { Avatar, Card } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import style from './notepage.module.scss';
import LoadingCard from '../components/common/LoadingCard';
import LoadError from '../components/common/LoadError';
import Header from '../components/common/Header';
import { useHistory } from 'react-router';
import IconFont from '../components/common/icon/NotedlyIcons';

const { Meta } = Card;

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

const NotePage = (): JSX.Element => {
  const { id } = useParams<Params>();

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
      <div>
        <Header title='详情' backable onBack={onBack} />
        <Card
          className={style['post-card']}
          actions={[
            <IconFont type='icon-comment' />,
            <EllipsisOutlined key='ellipsis' />,
          ]}
        >
          <Meta
            avatar={<Avatar src={author.avatar} />}
            title={`@${author.username}`}
            description={`${createdAt.substr(0, 10)} ${createdAt.substr(
              11,
              8
            )}`}
          />
          <div className={style['post-card-body']}>{content}</div>
        </Card>
      </div>
    );
  }

  return <LoadError />;
};

export default NotePage;
