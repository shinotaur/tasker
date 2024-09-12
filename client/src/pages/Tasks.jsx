import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaList } from 'react-icons/fa';
import { MdGridView } from 'react-icons/md';
import Loading from '../components/Loading';
import Title from '../components/Title';
import { IoMdAdd } from 'react-icons/io';
import Button from '../components/Button';
import Tabs from '../components/Tabs';
import TaskTitle from '../components/TaskTitle';
import BoardView from '../components/BoardView';
import Table from '../components/task/Table';
import AddTask from '../components/task/AddTask';
import { useGetAllTasksQuery } from '../redux/slices/api/taskApiSlice';

const TABS = [
  { title: 'Board View', icon: <MdGridView /> },
  { title: 'List View', icon: <FaList /> },
];

const TASK_TYPE = {
  todo: 'bg-cyan-600',
  'in progress': 'bg-yellow-600',
  completed: 'bg-green-600',
};

const Tasks = () => {
  const params = useParams();
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const status = params?.status || '';

  const { data, isLoading } = useGetAllTasksQuery({
    strQuery: status,
    isTrashed: '',
    search: '',
  });

  return isLoading ? (
    <div className='py-10'>
      <Loading />
    </div>
  ) : (
    <div className='w-full'>
      <div className='flex items-center justify-between mb-4'>
        <Title title={status ? `${status} Tasks` : 'Tasks'} />
        {!status && (
          <Button
            onClick={() => setOpen(true)}
            label='Create Task'
            icon={<IoMdAdd className='text-lg' />}
            className='flex flex-row gap-1 items-center bg-cyan-600 text-white rounded-md py-2 2xl:py-2.5'
          />
        )}
      </div>
      <div>
        <Tabs tabs={TABS} setSelected={setSelected}>
          {!status && (
            <div className='w-full flex justify-between gap-4 md:gap-x-12 py-4'>
              <TaskTitle label='To Do' className={TASK_TYPE.todo} />
              <TaskTitle
                label='In Progress'
                className={TASK_TYPE['in progress']}
              />
              <TaskTitle label='Completed' className={TASK_TYPE.completed} />
            </div>
          )}

          {selected === 0 ? (
            <BoardView tasks={data?.tasks} />
          ) : (
            <Table tasks={data?.tasks} />
          )}
        </Tabs>

        <AddTask open={open} setOpen={setOpen} />
      </div>
    </div>
  );
};

export default Tasks;
