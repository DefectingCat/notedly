import { useEffect, useState } from 'react';
import { Avatar, Card, message } from 'antd';
import style from './post.module.scss';
import { Notes } from '../../pages/Home';
import ActionBar from '../common/ActionBar';
import useStore from '../../store';
import { useHistory } from 'react-router';
import { useMutation, gql } from '@apollo/client';
import cloneDeep from 'lodash/cloneDeep';

const { Meta } = Card;

interface FavoVars {
  toggleFavoriteId: string;
}

interface FavoRes {
  toggleFavorite: ToggleFavorite;
}

interface ToggleFavorite {
  id: string;
  favoriteCount: number;
  favoritedBy: FavoritedBy[];
}

interface FavoritedBy {
  id: string;
  username: string;
}

const FAVO_QL = gql`
  mutation ToggleFavoriteMutation($toggleFavoriteId: ID!) {
    toggleFavorite(id: $toggleFavoriteId) {
      id
      favoriteCount
      favoritedBy {
        id
        username
      }
    }
  }
`;

const Post = (props: Notes): JSX.Element => {
  const { id, createdAt, content, author, commentNum } = props;
  let { favoritedBy, favoriteCount } = props;

  const history = useHistory();
  const { state, setUserState } = useStore();

  /**
   * 点赞
   */
  const [favo] = useMutation<FavoRes, FavoVars>(FAVO_QL);

  let scrolledTop = 0;

  /**
   * 从 Post 列表进入到详情页面 NotePage 时
   * 记录当前 scrolledTop 值到状态管理
   * 用于返回首页时滚动到指定位置
   */
  const intoPost = () => {
    scrolledTop = document.documentElement.scrollTop || document.body.scrollTop;
    setUserState({ ...state, scrolledTop });
    history.push({
      pathname: `/note/${id}`,
    });
  };

  /**
   * 根据当前登录用户
   * 判断是当前用户是否已经点赞
   */
  const [favoed, setFavoed] = useState(false);

  useEffect(() => {
    setFavoed(!!favoritedBy.find((item) => item.id === state.user.id));
  }, [favoritedBy, state.user.id]);

  /**
   * 该方法用于传递给子组件更新点赞状态
   */
  const toFavo = async () => {
    try {
      const { data } = await favo({
        variables: { toggleFavoriteId: id },
      });
      let { notes, myNotes } = state;
      if (notes || myNotes) {
        const deepNotes = cloneDeep(notes);
        const deepMyNotes = cloneDeep(myNotes);
        const note = deepNotes?.find((item) => item.id === id);
        const myNote = deepMyNotes?.find((item) => item.id === id);

        /**
         * 对当前状态中的点赞信息进行修改
         * 提交状态后，父组件会根据 props 变化来重新渲染当前组件
         */
        if (data?.toggleFavorite) {
          if (note) {
            note.favoriteCount = data.toggleFavorite.favoriteCount;
            note.favoritedBy = data.toggleFavorite.favoritedBy;
          }
          if (myNote) {
            myNote.favoriteCount = data.toggleFavorite.favoriteCount;
            myNote.favoritedBy = data.toggleFavorite.favoritedBy;
          }
          setUserState({ ...state, notes: deepNotes, myNotes: deepMyNotes });
        }
      }
    } catch (e) {
      console.log(e);
      message.error('点赞失败😲');
    }
  };

  return (
    <>
      <Card
        className={style['post-card']}
        actions={
          favoed
            ? [
                <ActionBar
                  favoriteCount={favoriteCount}
                  id={id}
                  key={id}
                  favoed={favoed}
                  toFavo={toFavo}
                  commentNum={commentNum}
                />,
              ]
            : [
                <ActionBar
                  favoriteCount={favoriteCount}
                  id={id}
                  key={id}
                  favoed={favoed}
                  toFavo={toFavo}
                  commentNum={commentNum}
                />,
              ]
        }
        hoverable
      >
        <div onClick={intoPost}>
          <Meta
            avatar={<Avatar src={author.avatar} />}
            title={`@${author.username}`}
            description={`${createdAt.substr(0, 10)} ${createdAt.substr(
              11,
              8
            )}`}
          />
          <div className={style['post-card-body']}>{content}</div>
        </div>
      </Card>
    </>
  );
};

export default Post;
