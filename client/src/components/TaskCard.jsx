import React, { useState } from 'react';
import { BGS, PRIORITY_STYLES, TASK_TYPE, formatDate } from '../utils';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { BiMessageAltDetail } from 'react-icons/bi';
import {
  MdAttachFile,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from 'react-icons/md';
import TaskDialog from './task/TaskDialog';
import { FaList } from 'react-icons/fa';
import UserInfo from './UserInfo';
import { IoMdAdd } from 'react-icons/io';
import AddSubTask from './task/AddSubTask';

const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const TaskCard = ({ task }) => {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className='w-full h-fit bg-white shadow-md p-4 rounded'>
        <div className='w-full flex justify-between'>
          <div
            className={clsx(
              'flex flex-1 gap-1 items-center text-sm font-medium',
              PRIORITY_STYLES[task?.priority]
            )}
          >
            <span className='text-lg'>{ICONS[task?.priority]}</span>
            <span>{task?.priority}</span>
          </div>
          {user?.isAdmin && <TaskDialog task={task} />}
        </div>
        <>
          <div className='flex items-center gap-2'>
            <div
              className={clsx('w-4 h-4 rounded-full', TASK_TYPE[task.stage])}
            />

            <h4 className='line-clamp-1 text-black'>{task?.title}</h4>
          </div>
          <span className='text-sm text-gray-600'>
            {formatDate(new Date(task?.date))}
          </span>
        </>

        <div className='w-full border-b border-gray-200 my-2' />
        <div className='flex items-center justify-between mb-2'>
          <div className='flex items-center gap-3 '>
            <div className='flex gap-0 items-center text-sm text-gray-600'>
              <BiMessageAltDetail />
              <span>{task?.activities?.length}</span>
            </div>
            <div className='flex gap-0 items-center text-sm text-gray-600'>
              <MdAttachFile />
              <span>{task?.assets?.length}</span>
            </div>
            <div className='flex gap-0 items-center text-sm text-gray-600'>
              <FaList />
              <span>{task?.subTasks?.length}</span>
            </div>
          </div>
          <div className='flex flex-row-reverse'>
            {task?.team?.map((m, index) => (
              <div
                key={index}
                className={clsx(
                  'w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1',
                  BGS[index % BGS?.length]
                )}
              >
                <UserInfo user={m} />
              </div>
            ))}
          </div>
        </div>

        {/* sub Tasks */}
        {task?.subTasks?.length > 0 ? (
          <div className='py-4 border-t border-gray-200'>
            <h5 className='text-base line-clamp-1 text-black'>
              {task?.subTasks[0].title}
            </h5>
            <div className='p-4 space-x-8'>
              <span className='text-sm text-gray-600'>
                {formatDate(new Date(task?.subTasks[0].date))}
              </span>
              <span className='bg-cyan-600/10 px-3 py-1 rounded-full text-cyan-700 font-medium'>
                {task?.subTasks[0].tag}
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className='py-4 border-t border-gray-200'>
              <span className='text-gray-500'>No Sub Task</span>
            </div>
          </>
        )}

        <div className='w-full pb-2 '>
          <button
            onClick={() => setOpen(true)}
            className='w-full flex gap-4 items-center text-sm text-gray-500 font-semibold disabled:cursor-not-allowed disabled:text-gray-300'
            disabled={user?.isAdmin ? false : true}
          >
            <IoMdAdd className='text-lg' />
            <span className=''>Add Subtask</span>
          </button>
        </div>
      </div>
      <AddSubTask open={open} setOpen={setOpen} id={task?._id} />
    </>
  );
};

export default TaskCard;
