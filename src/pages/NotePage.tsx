import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { Avatar, Card } from 'antd';
import {
  HeartOutlined,
  EllipsisOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import style from './notepage.module.scss';
import LoadingCard from '../components/common/LoadingCard';

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
  favoriteCount: number;
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
      favoriteCount
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
  const { data, loading, error, fetchMore } = useQuery<Note, Params>(GET_NOTE, {
    variables: { id },
  });

  if (loading) return <LoadingCard loading />;

  if (data) {
    const { createdAt, content, favoriteCount, author } = data.note;

    return (
      <div>
        <Card
          className={style['post-card']}
          actions={[
            <HeartOutlined key='heart' />,
            <MessageOutlined key='msg' />,
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

  return <p>load failure</p>;
};

export default NotePage;
