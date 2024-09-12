import React from 'react';
import {
  MdAdminPanelSettings,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from 'react-icons/md';
import { LuClipboardEdit } from 'react-icons/lu';
import { FaNewspaper, FaUsers } from 'react-icons/fa';
import { FaArrowsToDot } from 'react-icons/fa6';
import moment from 'moment';
import clsx from 'clsx';
import Chart from '../components/Chart';
import { BGS, PRIORITY_STYLES, TASK_TYPE, getInitials } from '../utils';
import Card from '../components/Card';
import UserInfo from '../components/UserInfo';
import Loading from '../components/Loading';
import { useGetDashboardStatsQuery } from '../redux/slices/api/taskApiSlice';

const TaskTable = ({ tasks }) => {
  const ICONS = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />,
  };
  const TableHeader = () => (
    <thead className='border-b border-gray-300'>
      <tr className='text-black text-left '>
        <th className='py-2'>Task Title</th>
        <th className='py-2'>Priority</th>
        <th className='py-2'>Team</th>
        <th className='py-2 hidden md:block'>Created At</th>
      </tr>
    </thead>
  );
  const TableRow = ({ task }) => (
    <tr className='border-gray-300 border-b text-gray-600 hover:bg-gray-300/10'>
      <td className='py-2 '>
        <div className='flex items-center gap-2'>
          <div
            className={clsx('w-4 h-4 rounded-full', TASK_TYPE[task.stage])}
          />
          <p className='text-base text-black'>{task.title}</p>
        </div>
      </td>
      <td className='py-2'>
        <div className='flex gap-1 items-center '>
          <span className={clsx('text-lg', PRIORITY_STYLES[task.priority])}>
            {ICONS[task.priority]}
          </span>
          <span className='capitalize'>{task.priority}</span>
        </div>
      </td>
      <td className='py-2'>
        <div className='flex '>
          {task.team.map((m, index) => (
            <div
              className={clsx(
                'w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1',
                BGS[index % BGS.length]
              )}
              key={index}
            >
              <UserInfo user={m} />
            </div>
          ))}
        </div>
      </td>
      <td className='py-2 md:block'>
        <span className='text-base text-gray-600'>
          {moment(task?.date).fromNow()}
        </span>
      </td>
    </tr>
  );
  return (
    <>
      <div className='w-full md:w-2/3 bg-white px-2 md:px-4 pb-4 pt-4 shadow-md rounded'>
        <table className='w-full'>
          <TableHeader />
          <tbody>
            {tasks.map((task, id) => (
              <TableRow key={id} task={task} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

const UserTable = ({ users }) => {
  const TableHeader = () => (
    <thead className='border-b border-gray-300 '>
      <tr className='text-black  text-left'>
        <th className='py-2'>Full Name</th>
        <th className='py-2'>Status</th>
        <th className='py-2'>Created At</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }) => (
    <tr className='border-b border-gray-200  text-gray-600 hover:bg-gray-400/10'>
      <td className='py-2'>
        <div className='flex items-center gap-3 text-left'>
          <div className='w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-violet-700'>
            <span className='text-center'>{getInitials(user?.name)}</span>
          </div>

          <div>
            <p> {user.name}</p>
            <span className='text-xs text-black'>{user?.role}</span>
          </div>
        </div>
      </td>

      <td>
        <p
          className={clsx(
            'w-fit px-3 py-1 rounded-full text-sm',
            !user?.isActive ? 'bg-cyan-200' : 'bg-yellow-100'
          )}
        >
          {!user?.isActive ? 'Active' : 'Disabled'}
        </p>
      </td>
      <td className='py-2 text-sm'>{moment(user?.createdAt).fromNow()}</td>
    </tr>
  );

  return (
    <div className='w-full md:w-1/3 bg-white h-fit px-2 md:px-6 py-4 shadow-md rounded'>
      <table className='w-full mb-5'>
        <TableHeader />
        <tbody>
          {users?.map((user, index) => (
            <TableRow key={index + user?._id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Dashboard = () => {
  const { data, isLoading } = useGetDashboardStatsQuery();

  if (isLoading) {
    return (
      <div className='py-8'>
        <Loading />
      </div>
    );
  }

  const totals = data?.tasks;

  const stats = [
    {
      _id: '1',
      label: 'TOTAL TASK',
      total: data?.totalTasks || 0,
      icon: <FaNewspaper />,
      bg: 'bg-[#1d4ed8]',
    },
    {
      _id: '2',
      label: 'COMPLETED TASK',
      total: totals['completed'] || 0,
      icon: <MdAdminPanelSettings />,
      bg: 'bg-[#0f766e]',
    },
    {
      _id: '3',
      label: 'TASK IN PROGRESS ',
      total: totals['in progress'] || 0,
      icon: <LuClipboardEdit />,
      bg: 'bg-[#f59e0b]',
    },
    {
      _id: '4',
      label: 'TODOS',
      total: totals['todo'],
      icon: <FaArrowsToDot />,
      bg: 'bg-[#be185d]' || 0,
    },
  ];
  return (
    <div className='h-full py-4'>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-5'>
        {stats?.map(({ label, total, bg, icon }, index) => (
          <Card key={index} icon={icon} bg={bg} label={label} count={total} />
        ))}
      </div>
      <div className='w-full bg-white my-16 p-4 rounded shadow-sm'>
        <h4 className='text-xl text-gray-600 font-semibold'>
          Chart by Priority
        </h4>
        <Chart data={data?.graphData} />
      </div>
      <div className='w-full flex flex-col md:flex-row gap-4 2xl:gap-10 py-8'>
        {/* left */}

        <TaskTable tasks={data?.last10Task} />

        {/* right */}
        <UserTable users={data?.users} />
      </div>
    </div>
  );
};

export default Dashboard;
