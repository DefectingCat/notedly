import style from './actionBar.module.scss';

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
            <svg className='icon' aria-hidden='true'>
              <use xlinkHref='#icon-xinaixin-fuben'></use>
            </svg>
          ) : (
            <svg className='icon' aria-hidden='true'>
              <use xlinkHref='#icon-aixin2'></use>
            </svg>
          )}
          <span>{favoriteCount}</span>
        </div>

        {/* 这个是评论按钮💬 */}
        <div className={`${style.action}`}>
          <svg className='icon' aria-hidden='true'>
            <use xlinkHref='#icon-comment'></use>
          </svg>
          <span>0</span>
        </div>
      </div>
    </>
  );
};

export default ActionBar;
