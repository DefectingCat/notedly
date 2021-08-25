import React from 'react';
import { EllipsisOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Popover, message } from 'antd';
import style from './moreaction.module.scss';
import useStore from '../../store';
import useDeleteNote from '../../hooks/graphQL/useDeleteNote';
import { useHistory } from 'react-router';
import cloneDeep from 'lodash/cloneDeep';

interface Props {
  postId: string;
  userId: string;
}

const MoreAction: React.FC<Props> = ({ postId, userId }) => {
  const { state, setUserState } = useStore();
  const { user, notes, myNotes } = state;
  const history = useHistory();
  const { delNote, loading } = useDeleteNote();

  /**
   * 在成功删除 post 后
   * 直接更新 state 中的数据
   * 将当前已经删除的 post 删除
   */
  const deleteNote = async () => {
    return new Promise((resolve, reject) => {
      try {
        const deepNotes = cloneDeep(notes);
        const deepMyNotes = cloneDeep(myNotes);

        // 从两个状态中寻找对应的数据
        if (deepNotes) {
          const noteIndex = deepNotes.findIndex((item) => item.id === postId);
          deepNotes.splice(noteIndex, 1);
        }

        if (deepMyNotes) {
          const myNoteIndex = deepMyNotes.findIndex(
            (item) => item.id === postId
          );
          deepMyNotes.splice(myNoteIndex, 1);
        }

        // setUserState 只能执行一次
        // 所以必须判断两个状态是否有一个不存在，避免将 undifined 存入
        if (deepNotes && deepMyNotes) {
          setUserState({ ...state, notes: deepNotes, myNotes: deepMyNotes });
        } else if (deepNotes) {
          setUserState({ ...state, notes: deepNotes });
        } else {
          setUserState({ ...state, myNotes: deepMyNotes });
        }

        resolve(null);
      } catch (e) {
        reject(e);
      }
    });
  };

  const handleDelete = async () => {
    const result = await delNote({
      variables: {
        delNoteId: postId,
      },
    });
    if (!result) return message.error('删除失败😲');
    await deleteNote();
    message.success('删除成功🦄');
    history.go(-1);
  };

  /**
   * 通过当前 post 的 author.id 与已经登录用户 id 进行判断
   * 当是同一个用户时，则允许删除
   */
  const content = (
    <div>
      <Button
        type='text'
        icon={<DeleteOutlined />}
        disabled={user.id !== userId}
        onClick={handleDelete}
        loading={loading}
      >
        删除
      </Button>
    </div>
  );

  return (
    <>
      <Popover content={content} trigger='click' className={style.more}>
        <EllipsisOutlined key='ellipsis' />
      </Popover>
    </>
  );
};

export default MoreAction;
