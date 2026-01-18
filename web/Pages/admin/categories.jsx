import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../css/categories.css";
import { FaPlus, FaPencilAlt, FaMagic } from "react-icons/fa";

const Colors = {
  primary: "#6c3483",
  secondary: "#A78BFA",
  background: "#f5f0fa",
  card: "#6c3483",
  textSecondary: "#D1D5DB",
};

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState(null);

  const [aiLoading, setAiLoading] = useState(false);

  const ip = "localhost";

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ================= Fetch Categories ================= */
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`http://${ip}:5000/api/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  /* ================= AI Function ================= */
  const generateNameAndDescription = async (currentName, setNameFn, setDescriptionFn) => {
    if (!currentName) return;
    setAiLoading(true);
    try {
      const res = await axios.post(`http://${ip}:5000/api/ai/category-suggest`, {
        name: currentName,
      });

      setNameFn(res.data.name);
      setDescriptionFn(res.data.description);
    } catch (err) {
      console.error("AI generation failed:", err);
    } finally {
      setAiLoading(false);
    }
  };

  /* ================= CRUD ================= */
  const addCategory = async () => {
    if (!name || !description || !image) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("cover_image", image);

    try {
      await axios.post(`http://${ip}:5000/api/addCategory`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAddModalVisible(false);
      setName("");
      setDescription("");
      setImage(null);
      fetchCategories();
    } catch (err) {
      console.error("Add category failed:", err);
    }
  };

  const openEditModal = (cat) => {
    setEditCategoryId(cat.category_id);
    setEditName(cat.name);
    setEditDescription(cat.description);
    setEditImage(null);
    setEditModalVisible(true);
  };

  const saveEditCategory = async () => {
    if (!editCategoryId || !editName || !editDescription) return;

    const formData = new FormData();
    formData.append("category_id", editCategoryId);
    formData.append("name", editName);
    formData.append("description", editDescription);

    if (editImage && editImage instanceof File) {
      formData.append("cover_image", editImage);
    }

    try {
      await axios.put(`http://${ip}:5000/api/updateCategory`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setEditModalVisible(false);
      setEditCategoryId(null);
      setEditName("");
      setEditDescription("");
      setEditImage(null);
      fetchCategories();
    } catch (err) {
      console.error("Edit category failed:", err);
    }
  };

  /* ================= Filtered List ================= */
  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleImageChange = (e, setImageFn) => {
    if (e.target.files && e.target.files[0]) {
      setImageFn(e.target.files[0]);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="categories-container">
      <div className="header-row">
        <h2 style={{ color: Colors.primary }}>Categories</h2>
        <button className="add-btn" onClick={() => setAddModalVisible(true)}>
          <FaPlus color="#fff" />
        </button>
      </div>

      <input
        type="text"
        placeholder="Search category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search"
      />

      <div className="categories-list">
        {filtered.map((item) => (
          <div className="card" key={item.category_id}>
            <img src={item.cover_image} alt={item.name} className="card-image" />
            <div className="card-info">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
            </div>
            <button className="edit-btn" onClick={() => openEditModal(item)}>
              <FaPencilAlt color="#fff" />
            </button>
          </div>
        ))}
      </div>

      {/* ================= Add Modal ================= */}
      {addModalVisible && (
        <div className="modal">
          <h3>Add Category</h3>
          <input
            type="text"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="ai-row">
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button
              className="ai-btn"
              disabled={aiLoading}
              onClick={() => generateNameAndDescription(name, setName, setDescription)}
            >
              {aiLoading ? "Generating..." : "✨ Improve Name & Description with AI"}
            </button>
          </div>

          <input type="file" onChange={(e) => handleImageChange(e, setImage)} />

          <div className="modal-buttons">
            <button className="save-btn-category" onClick={addCategory}>
              Save
            </button>
            <button className="cancel-btn-category" onClick={() => setAddModalVisible(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ================= Edit Modal ================= */}
      {editModalVisible && (
        <div className="modal">
          <h3>Edit Category</h3>
          <input
            type="text"
            placeholder="Category Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />

          <div className="ai-row">
            <input
              type="text"
              placeholder="Description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
            <button
              className="ai-btn"
              disabled={aiLoading}
              onClick={() =>
                generateNameAndDescription(editName, setEditName, setEditDescription)
              }
            >
              {aiLoading ? "Generating..." : "✨ Edit Name & Description with AI"}
            </button>
          </div>

          <input type="file" onChange={(e) => handleImageChange(e, setEditImage)} />

          <div className="modal-buttons">
            <button className="save-btn-category" onClick={saveEditCategory}>
              Save
            </button>
            <button className="cancel-btn-category" onClick={() => setEditModalVisible(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
