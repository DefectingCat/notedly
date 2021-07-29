import style from './actionBar.module.scss';
import IconFont from './icon/NotedlyIcons';

interface Props {
  favoriteCount: number;
  id: string;
  favoed: boolean;
  toFavo: () => Promise<void>;
}

const ActionBar = ({ favoriteCount, favoed, toFavo }: Props): JSX.Element => {
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
          <span>0</span>
        </div>
      </div>
    </>
  );
};

export default ActionBar;
