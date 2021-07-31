import { Card } from 'antd';
import style from './comment.module.scss';
import PostComment from './PostComment';
import NewComment from './NewComment';
import { useQuery, gql } from '@apollo/client';

interface Props {
  id: string;
}

export interface Comments {
  comments: CommentsClass;
}

export interface CommentsClass {
  comments: Comment[];
  cursor: string;
  hasNextPage: boolean;
}

export interface Comment {
  id: string;
  content: string;
  author: Author;
  favoriteCount: number;
  favoritedBy: any[];
  createdAt: string;
  reply: any[];
}

export interface Author {
  id: string;
  username: string;
  avatar: string;
}

const GET_COMMENT = gql`
  query Query($commentsPost: ID!, $commentsCursor: String) {
    comments(post: $commentsPost, cursor: $commentsCursor) {
      comments {
        id
        content
        author {
          id
          username
          avatar
        }
        favoriteCount
        favoritedBy {
          id
          username
        }
        createdAt
        reply {
          parent
          content
          author {
            id
            username
            avatar
          }
          toUser {
            id
            username
            avatar
          }
          favoriteCount
          favoritedBy {
            id
            username
          }
        }
      }
      cursor
      hasNextPage
    }
  }
`;

const CommentList = ({ id }: Props) => {
  return (
    <>
      {id}
      <Card className={style['com-card']}>
        <PostComment />
        <PostComment>
          <PostComment />
        </PostComment>
      </Card>

      <Card className={style['com-card']}>
        <NewComment />
      </Card>
    </>
  );
};

export default CommentList;
