import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchUpdata, fetchUserAccount } from '../features/blogSlice';
import Button from '../component/Button';

export default function UpdateBlog() {
  const { id } = useParams(); // blog ID from URL
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentBlog, status, error } = useSelector(state => state.blog);

  const [form, setForm] = useState({
    title: '',
    description: '',
    image: ''
  });

  console.log('current data',currentBlog.title)
  // Fetch blog if not loaded
  useEffect(() => {
    if (!currentBlog || currentBlog?.id?.toString() !== id) {
      dispatch(fetchUserAccount(id));
    }
  }, [currentBlog, id, dispatch]);

  // Prefill form when currentBlog is loaded
  useEffect(() => {
    if (currentBlog && currentBlog?.id?.toString()=== id) {
      setForm({
        title: currentBlog.title || '',
        description: currentBlog.description || '',
        image: currentBlog.image || ''
      });
    }
  }, [currentBlog, id]);

  // Handle input changes
  function handleFormData(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  // Handle form submission
  function handleForm(e) {
    e.preventDefault();
    dispatch(fetchUpdata({ id, updateData: form }))
      .unwrap()
      .then(() => navigate('/')) // Redirect after success
      .catch(err => console.log(err));
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-900 to-indigo-900 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-6">
          Update Blog
        </h1>

        <form onSubmit={handleForm} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-1">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleFormData}
              required
              placeholder="Enter blog title"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-1">Image URL</label>
            <input
              name="image"
              value={form.image}
              onChange={handleFormData}
              required
              placeholder="https://example.com/image.jpg"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-semibold mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleFormData}
              required
              placeholder="Write your blog description..."
              className="px-4 py-2 border border-gray-300 rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <Button
            type="submit"
            name={status === "loading" ? "Updating..." : "Update Blog"}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg mt-2 transition-colors duration-300"
            disabled={status === "loading"}
          />
        </form>

        {error && <p className="text-red-500 mt-3 text-center font-medium">{error}</p>}
      </div>
    </div>
  );
}
