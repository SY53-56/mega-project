import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../component/Button";
import { fetchAddData } from "../features/BlogThunk";

export default function AddBlog() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, error } = useSelector((state) => state.blog);

  const [form, setForm] = useState({
    title: "",
    description: "",
  });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  /* ================= INPUT HANDLER ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= FILE HANDLER ================= */
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    const previewUrls = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );
    setPreviews(previewUrls);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    files.forEach((file) => formData.append("images", file));

    try {
      await dispatch(fetchAddData(formData)).unwrap();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= CLEANUP ================= */
  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-blue-900 p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          Create New Blog
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Blog title"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Write your story..."
            className="w-full h-32 px-4 py-2 border rounded-lg resize-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <label className="flex items-center justify-center gap-3 cursor-pointer border-2 border-dashed rounded-lg p-4 text-gray-600 hover:border-indigo-500">
            <span>Upload Images</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              hidden
            />
          </label>

          {previews.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {previews.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="preview"
                  className="h-24 w-full object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          <Button
            type="submit"
            disabled={status === "loading"}
            name={status === "loading" ? "Posting..." : "Post Blog"}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
          />
        </form>

        {error && (
          <p className="text-red-500 text-center mt-4">{error}</p>
        )}
      </div>
    </div>
  );
}
