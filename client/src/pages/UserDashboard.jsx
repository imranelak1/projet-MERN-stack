import { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { UserContext } from '../../context/userContext';
import { api } from '../services/mockApi';
import toast from 'react-hot-toast';
import { FaCheckCircle, FaTrash, FaClock } from 'react-icons/fa';
import { format } from 'date-fns';

const UserDashboard = () => {
  const [filter, setFilter] = useState('all');
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm();
  const { user,loading } = useContext(UserContext);

  // Fetch tasks
  useEffect(() => {
    console.log('User context:', user); 
    if (user) {
      setIsLoading(true);
      api
        .getTasks(user.id)
        .then((data) => setTasks(data))
        .catch(() => toast.error('Failed to fetch tasks'))
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  // Create a new task
  const createTask = (newTask) => {
    if (loading) {
      console.log('Still loading user data');
      return;
    }

    console.log('User state when creating task:', user);
    
    if (user && user.id) {
      api.createTask({ ...newTask, userId: user.id })
        .then((createdTask) => {
          setTasks((prevTasks) => [...prevTasks, createdTask]);
          toast.success('Task created successfully');
          reset();
        })
        .catch((error) => {
          console.error('Create task error:', error);
          toast.error('Failed to create task');
        });
    } else {
      toast.error('User is not logged in');
    }
  };
  // Update a task's status
  const updateTask = (id, status) => {
    // Add these logs at the start of the function
    console.log('Update task ID:', id);
    console.log('Current tasks:', tasks);
  
    api
      .updateTask(id, { status })
      .then((updatedTask) => {
        // Add this log in the .then() block
        console.log('Updated task from server:', updatedTask);
        
        setTasks((prevTasks) =>
          prevTasks.map((task) => {
            // Add this log inside the map function
            console.log('Comparing:', { taskId: task._id, updateId: id });
            return task._id === id ? { ...task, status: updatedTask.status } : task
          })
        );
        toast.success('Task updated successfully');
      })
      .catch((error) => {
        // Add this log in the catch block
        console.error('Update error:', error);
        toast.error('Failed to update task')
      });
  };

  // Delete a task
  const deleteTask = (id) => {
    api
      .deleteTask(id)
      .then(() => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
        toast.success('Task deleted successfully');
      })
      .catch(() => toast.error('Failed to delete task'));
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.status === 'completed';
    if (filter === 'pending') return task.status === 'pending';
    return true;
  });

  // Handle form submission
  const onSubmit = (data) => {
    createTask({ ...data, status: 'pending' });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Create New Task</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register('title', { required: true })}
              className="w-full p-2 border rounded"
              placeholder="Task title"
            />
          </div>
          <div>
            <textarea
              {...register('description')}
              className="w-full p-2 border rounded"
              placeholder="Task description"
              rows="3"
            />
          </div>
          <div>
            <input
              type="date"
              {...register('dueDate')}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Create Task
          </button>
        </form>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">My Tasks</h2>
          <div className="space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1 rounded ${filter === 'pending' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1 rounded ${filter === 'completed' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
            >
              Completed
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div key={task._id} className="border rounded-lg p-4 flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="font-semibold">{task.title}</h3>
                <p className="text-gray-600">{task.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <FaClock className="mr-1" />
                  {format(new Date(task.dueDate), 'MMM d, yyyy')}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateTask(task._id, task.status === 'completed' ? 'pending' : 'completed')}
                  className={`p-2 rounded ${
                    task.status === 'completed' ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  <FaCheckCircle />
                </button>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="p-2 text-red-600 rounded hover:bg-red-50"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
