import React, { useState } from "react";
import Sidebar from "../Sidebar";
import { servicesAPI } from "../../api/apiClient";
import { Plus, Edit2, Trash2, X, Upload } from "lucide-react";

const Services = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  React.useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    servicesAPI
      .getAll()
      .then((res) => {
        const all = res.data.services || [];
        // Filter services that belong to this vendor (vendor stored as user id)
        const mine = all.filter((s) => s.vendor && s.vendor._id === user.id);
        setServices(
          mine.map((s) => ({
            id: s._id,
            name: s.title,
            price: s.plans?.[0]?.price || 0,
            description: s.description,
            image: s.image,
          })),
        );
      })
      .catch((err) => console.error("Failed to load vendor services", err))
      .finally(() => setLoading(false));
  }, []);
  const [newService, setNewService] = useState({
    name: "",
    price: "",
    description: "",
    image: null,
  });
  const [editingId, setEditingId] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a fake local URL for preview
      const imageUrl = URL.createObjectURL(file);
      setNewService({ ...newService, image: imageUrl });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setServices(
        services.map((s) =>
          s.id === editingId
            ? { ...s, ...newService, price: Number(newService.price) }
            : s,
        ),
      );
      setEditingId(null);
    } else {
      const id =
        services.length > 0 ? Math.max(...services.map((s) => s.id)) + 1 : 1;
      setServices([
        ...services,
        { ...newService, id, price: Number(newService.price) },
      ]);
    }
    setNewService({ name: "", price: "", description: "", image: null });
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    setServices(services.filter((s) => s.id !== id));
  };

  const handleEdit = (service) => {
    setEditingId(service.id);
    setNewService({
      name: service.name,
      price: service.price,
      description: service.description,
      image: service.image,
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingId(null);
    setNewService({ name: "", price: "", description: "", image: null });
    setIsModalOpen(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <Sidebar />
      <div className="pt-10 pb-12 px-4 sm:px-6 lg:px-8 transition-all">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">
                My Services
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage the services you offer to customers
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="bg-[#088395] hover:bg-[#088395]/70 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Service
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(service)}
                      className="p-2 bg-white/90 rounded-full text-[#088395] hover:bg-white shadow-sm"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2 bg-white/90 rounded-full text-red-500 hover:bg-white shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900">
                      {service.name}
                    </h3>
                    <span className="font-bold text-[#088395] bg-[#088395]/20 px-2 py-1 rounded-lg text-sm">
                      ${service.price}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm line-clamp-2">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}

            {/* Empty State / Add Card */}
            <button
              onClick={openAddModal}
              className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 text-gray-400 hover:border-[#088395] hover:text-[#088395] hover:bg-blue-50/30 transition-all min-h-[300px]"
            >
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-[#088395]/20 transition-colors">
                <Plus className="w-8 h-8" />
              </div>
              <span className="font-bold">Add Another Service</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">
                {editingId ? "Edit Service" : "Add New Service"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Service Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#088395] outline-none"
                  value={newService.name}
                  onChange={(e) =>
                    setNewService({ ...newService, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  required
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#088395] outline-none"
                  value={newService.price}
                  onChange={(e) =>
                    setNewService({ ...newService, price: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#088395] outline-none resize-none"
                  value={newService.description}
                  onChange={(e) =>
                    setNewService({
                      ...newService,
                      description: e.target.value,
                    })
                  }
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Service Image
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center pointer-events-none">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 font-medium">
                      {newService.image
                        ? "Image Selected"
                        : "Click to upload image"}
                    </p>
                  </div>
                </div>
                {newService.image && (
                  <p className="text-xs text-green-600 mt-2 font-semibold text-center">
                    Image ready to upload
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#088395] text-white font-bold rounded-xl hover:bg-[#088395]/70 transition-colors mt-2"
              >
                {editingId ? "Update Service" : "Create Service"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
