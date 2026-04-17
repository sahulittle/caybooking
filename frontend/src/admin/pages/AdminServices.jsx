import React, { useState } from "react";
import { Plus, Edit2, Trash2, Folder, X } from "lucide-react";
import toast from "react-hot-toast";

const AdminServices = () => {
  const [activeTab, setActiveTab] = useState("categories");
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  const normalizeCategory = (cat) =>
    typeof cat === "string" ? cat : cat?.addCategory || cat?.name || "General";

  React.useEffect(() => {
    import("../../api/apiClient").then(({ adminAPI }) => {
      adminAPI
        .getAllServices()
        .then((res) => {
          // 🔥 DEBUG FULL RESPONSE
          console.log("FULL RESPONSE:", res.data);

          // 🔥 DEBUG EACH SERVICE
          res.data.services?.forEach((s) => {
            console.log("SERVICE CATEGORY:", s.category);
          });

          // ✅ FIXED setServices
          const formattedServices = (res.data.services || []).map((s) => ({
            id: s._id,
            name: s.plans?.[0]?.name || "Service",
            category: normalizeCategory(s.category),
            price: s.plans?.[0]?.price || 0,
            status: s.status || "Active",
          }));

          setServices(formattedServices);
        })
        .catch((err) => {
          console.error("Failed to load services", err);
        })
        .finally(() => {
          setLoadingServices(false);
        });
    });
  }, []);
  React.useEffect(() => {
    import("../../api/apiClient").then(({ adminAPI }) => {
      adminAPI
        .getCategories()
        .then((res) => {
          const data = res.data.data || [];

          setCategories(
            data.map((c) => ({
              id: c._id,
              name: c.addCategory,
              image: c.image,
              status: c.status,
            })),
          );
        })
        .catch((err) => {
          console.error("Failed to load categories", err);
          toast.error("Failed to load categories");
        });
    });
  }, []);

  const [currentService, setCurrentService] = useState({
    id: null,
    name: "",
    category: "",
    plans: [{ name: "", price: "" }],
    requirements: [],
    status: "Active",
  });

  const [currentCategory, setCurrentCategory] = useState({
    id: null,
    name: "",
    image: null,
    status: true,
  });

  const handleSaveService = async (e) => {
    e.preventDefault();

    try {
      const { adminAPI } = await import("../../api/apiClient");

      const plansPayload = (currentService.plans || []).map((p) => ({
        name: p.name || "Standard",
        price: Number(p.price) || 0,
      }));

      let created;

      if (currentService.id) {
        // UPDATE
        await adminAPI.updateService(currentService.id, {
          title: currentService.name,
          category: currentService.category,
          plans: plansPayload,
          status: currentService.status,
        });

        setServices((prev) =>
          prev.map((s) =>
            s.id === currentService.id
              ? {
                  ...s,
                  name: currentService.name,
                  category: currentService.category,
                  price: plansPayload[0]?.price || 0,
                  status: currentService.status,
                }
              : s,
          ),
        );

        toast.success("Service updated");
      } else {
        // CREATE
        const res = await adminAPI.createService({
          category: currentService.category,
          plans: plansPayload,
          requirements: currentService.requirements || [],
          status: currentService.status,
        });

        created = res.data.service;

        setServices((prev) => [
          ...prev,
          {
            id: created._id,
            name: created.plans?.[0]?.name || "Service",
            category: normalizeCategory(created.category),
            price: created.plans?.[0]?.price || 0,
            status: created.status,
          },
        ]);

        toast.success("Service created");
      }

      setIsServiceModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save service");
    }
  };

  const handleDeleteService = async (id) => {
    try {
      const { adminAPI } = await import("../../api/apiClient");
      await adminAPI.deleteService(id);
      setServices(services.filter((s) => s.id !== id));
      toast.success("Service deleted");
    } catch (err) {
      console.error(
        "Delete service error:",
        err.response?.status,
        err.response?.data,
        err.request || err.message,
      );
      const serverMessage =
        err.response?.data?.message || err.response?.data || err.message;
      toast.error(
        typeof serverMessage === "string"
          ? serverMessage
          : "Failed to delete service",
      );
    }
  };

  const openServiceModal = (service = null) => {
    if (service) {
      if (service.plans) {
        setCurrentService(service);
        setIsServiceModalOpen(true);
      } else {
        import("../../api/apiClient").then(async ({ servicesAPI }) => {
          try {
            const res = await servicesAPI.getById(service.id);
            const svc = res.data.service || res.data;
            setCurrentService({
              id: svc._id || svc.id,
              name: svc.title || svc.name,
              category: normalizeCategory(svc.category),
              plans: svc.plans || [{ name: "", price: "" }],
              requirements: svc.requirements || [],
              status: svc.status || "Active",
            });
          } catch (err) {
            console.error("Failed to fetch service details", err);
            setCurrentService({
              ...service,
              plans: [{ name: "", price: "" }],
              requirements: [],
            });
          } finally {
            setIsServiceModalOpen(true);
          }
        });
        return;
      }
    } else {
      setCurrentService({
        id: null,
        name: "",
        category: categories[0]?.name || "",
        plans: [{ name: "", price: "" }],
        requirements: [],
        status: "Active",
      });
    }

    setIsServiceModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();

    try {
      const { adminAPI } = await import("../../api/apiClient");

      const formData = new FormData();
      formData.append("addCategory", currentCategory.name);
      formData.append("status", currentCategory.status);

      if (currentCategory.image) {
        formData.append("image", currentCategory.image);
      }

      const res = await adminAPI.createCategory(formData);
      const created = res.data.category;

      setCategories((prev) => [
        ...prev,
        {
          id: created._id,
          name: created.addCategory,
          image: created.image,
          status: created.status,
        },
      ]);

      toast.success("Category created successfully");
      setIsCategoryModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create category");
    }
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter((c) => c.id !== id));
    toast.success("Category deleted");
  };

  const openCategoryModal = (category = null) => {
    if (category) {
      setCurrentCategory(category);
    } else {
      setCurrentCategory({
        id: null,
        name: "",
        image: null,
        status: true,
      });
    }
    setIsCategoryModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 space-y-5 sm:space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Services Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage services and categories offered
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("categories")}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === "categories"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Categories
          </button>

          <button
            onClick={() => setActiveTab("services")}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === "services"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Services
          </button>
        </div>
      </div>

      {activeTab === "services" ? (
        // Services View
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center flex-wrap gap-4">
            <h2 className="text-lg font-bold text-gray-900">All Services</h2>
            <button
              onClick={() => openServiceModal()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
            >
              <Plus className="w-4 h-4" /> Add Service
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                    name
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {services.map((service) => (
                  <tr
                    key={service.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {service.category} {/* Category */}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {service.name} {/* ✅ Service Name */}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                      ${service.price}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${service.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        {service.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openServiceModal(service)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              Categories
            </h2>
            <button
              onClick={() => openCategoryModal()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-sm"
            >
              <Plus className="w-4 h-4" /> Add Category
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="p-4 sm:p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all group"
              >
                <div className="flex justify-between items-start gap-3 mb-4">
                  <div className="p-3 bg-white rounded-lg border border-gray-200 text-blue-600 shrink-0">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    ) : (
                      <Folder className="w-6 h-6" />
                    )}
                  </div>

                  <div className="flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openCategoryModal(category)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-md"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 break-words">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {category.count || 0} active services
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Service Modal */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh]">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-base sm:text-lg text-gray-900">
                {currentService.id ? "Edit Service" : "New Service"}
              </h3>
              <button
                onClick={() => setIsServiceModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSaveService}
              className="p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-72px)]"
            >
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Category
                </label>
                <select
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={currentService.category}
                  onChange={(e) =>
                    setCurrentService({
                      ...currentService,
                      category: e.target.value,
                    })
                  }
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={currentService.status}
                  onChange={(e) =>
                    setCurrentService({
                      ...currentService,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Service Plans
                </label>

                {currentService.plans.map((plan, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 mb-3"
                  >
                    <input
                      type="text"
                      placeholder="Service Name"
                      className="w-full p-2.5 border border-gray-200 rounded-xl"
                      value={plan.name}
                      onChange={(e) => {
                        const updatedPlans = [...currentService.plans];
                        updatedPlans[index].name = e.target.value;
                        setCurrentService({
                          ...currentService,
                          plans: updatedPlans,
                        });
                      }}
                    />

                    <input
                      type="number"
                      placeholder="Price"
                      className="w-full p-2.5 border border-gray-200 rounded-xl"
                      value={plan.price}
                      onChange={(e) => {
                        const updatedPlans = [...currentService.plans];
                        updatedPlans[index].price = e.target.value;
                        setCurrentService({
                          ...currentService,
                          plans: updatedPlans,
                        });
                      }}
                    />

                    {currentService.plans.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updatedPlans = currentService.plans.filter(
                            (_, i) => i !== index,
                          );
                          setCurrentService({
                            ...currentService,
                            plans: updatedPlans,
                          });
                        }}
                        className="px-3 py-2.5 bg-red-100 text-red-600 rounded-xl"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setCurrentService({
                      ...currentService,
                      plans: [...currentService.plans, { name: "", price: "" }],
                    })
                  }
                  className="mt-2 text-sm text-blue-600 font-semibold"
                >
                  + Add Plan
                </button>
              </div>
              <div className="pt-4 flex flex-col-reverse sm:flex-row justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh]">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-base sm:text-lg text-gray-900">
                {currentCategory.id ? "Edit Category" : "New Category"}
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSaveCategory}
              className="p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-72px)]"
            >
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={currentCategory.name}
                  onChange={(e) =>
                    setCurrentCategory({
                      ...currentCategory,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Category Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full p-2.5 border border-gray-200 rounded-xl bg-white"
                  onChange={(e) =>
                    setCurrentCategory({
                      ...currentCategory,
                      image: e.target.files[0],
                    })
                  }
                />
              </div>

              <div className="pt-4 flex flex-col-reverse sm:flex-row justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="w-full sm:w-auto px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;
