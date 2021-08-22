import style from './actionBar.module.scss';
import IconFont from './icon/NotedlyIcons';

interface Props {
  favoriteCount: number;
  id: string;
  favoed: boolean;
  commentNum: number;
  toFavo: () => Promise<void>;
}

const ActionBar: React.FC<Props> = ({
  favoriteCount,
  favoed,
  commentNum,
  toFavo,
}: Props) => {
  return (
    <>
      <div className={style.warpper}>
        {/* 这个是点赞按钮💖 */}
        <div className={`${style.action}`} onClick={toFavo}>
          {favoed ? (
            <IconFont type='icon-xinaixin-fuben' />
          ) : (
            <IconFont type='icon-aixin2' />
          )}
          <span>{favoriteCount}</span>
        </div>

        {/* 这个是评论按钮💬 */}
        <div className={`${style.action}`}>
          <IconFont type='icon-comment' />
          <span>{commentNum == null ? 0 : commentNum}</span>
        </div>
      </div>
    </>
  );
};

export default ActionBar;
